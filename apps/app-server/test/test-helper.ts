import { zRes as zPostAuthDevRes } from '@/src/v1/routes/auth/dev/post';
import { zRes as zGetUserRes } from '@/src/v1/routes/users/base/get';
import { IncomingRequestCfProperties } from '@cloudflare/workers-types/experimental';
import jest from '@jest/globals';
import * as fs from 'fs';
import { Log, LogLevel, Miniflare, RequestInit } from 'miniflare';
import * as path from 'path';
import * as url from 'url';
import { createAPIHelper } from './helpers/api';

let _mf: Miniflare | null;
let is_init: boolean = false;
const _mf_deps = new Map();
const storage = new Map();

const PORT = 9090;

const getBindings = () => {
  const bindingRaw = fs.readFileSync(path.resolve(process.cwd(), '.test.vars'), {
    encoding: 'utf-8',
  });
  const bindings = bindingRaw
    .split('\n')
    .map((s) => s.match(/\s*([a-zA-Z_-]+)\s*=\s*"(.+)"\s*/i))
    .reduce((a: any, c) => {
      if (c == null) return a;
      a[c[1]] = c[2];
      return a;
    }, {});

  return bindings;
};

const migrateD1 = async (mf: Miniflare) => {
  const migration = fs.readFileSync(path.resolve(process.cwd(), 'migrations', '1.sql'), {
    encoding: 'utf8',
  });

  const db = await mf.getD1Database('DB');

  // trigger를 처리하지 못함
  // 트리거는 배제함
  for (const mig of migration.split(';')) {
    try {
      await db.prepare(mig).run();
    } catch (err) {}
    // await db.batch(migration.split(';').map((sql) => db.prepare(sql)));
  }
};

const initMiniflares = async () => {
  if (is_init) return;
  if (_mf == null) return;
  is_init = true;

  // migrate D1
  await migrateD1(_mf);
};

const getMiniflare = (id: string): Miniflare => {
  if (_mf == null) {
    _mf = new Miniflare({
      modules: true,
      scriptPath: path.resolve(process.cwd(), 'dist', 'index.js'),
      d1Databases: ['DB'],
      log: new Log(LogLevel.DEBUG), // Enable debug messages
      bindings: getBindings(),
      port: PORT,
    });

    // key set for using check
    _mf_deps.set(id, true);
  }
  return _mf;
};

/**
 * miniflare 의존성을 제거합니다
 * @param id
 */
const disposeMiniflare = async (id: string) => {
  if (_mf_deps.has(id)) {
    _mf_deps.delete(id);
  }
  if ([..._mf_deps.keys()].length) return;
  if (_mf == null) return;
  await _mf.dispose();
};

export class TestHelper {
  id: string;
  mf: Miniflare;
  pathname: string;
  apiHelper;

  constructor(pathname: string) {
    this.id = crypto.randomUUID();
    this.mf = getMiniflare(this.id);
    this.apiHelper = createAPIHelper(this.mf);

    this.pathname = pathname;

    jest.beforeAll(async () => {
      await initMiniflares();
      await this.apiHelper.post({ pathname: 'v1/dev/mock' });
    }, 1000 * 1000);

    jest.afterAll(async () => {
      return disposeMiniflare(this.id);
    });
  }

  /**
   * 현재 testHelper의 path로 리퀘스트
   * @param init
   * @returns
   */
  fetch = async (init?: RequestInit<Partial<IncomingRequestCfProperties>>) => {
    return (await this.mf).dispatchFetch(
      url.resolve(`http://localhost:${PORT}`, this.pathname),
      init
    );
  };

  /**
   * 다른 path로 리퀘스트
   * @param pathname
   * @param init
   * @returns
   */
  request = async (pathname: string, init?: RequestInit<Partial<IncomingRequestCfProperties>>) => {
    return (await this.mf).dispatchFetch(url.resolve(`http://localhost:${PORT}`, pathname), init);
  };

  /**
   * 유저를 생성합니다
   * @param email
   * @returns
   */
  signIn = async (email: string = 'test@test.com') => {
    const res = await this.request('/v1/auth/dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include',
    });

    const json = await res.json();
    const cookies = res.headers.getSetCookie();
    return { ...zPostAuthDevRes.parse(json), cookies: cookies };
  };

  /**
   *
   * @param registred 1,2,3
   * @returns
   */
  authDev = async (registred: number): Promise<{ access_token: string; cookie: string }> => {
    const res = await this.apiHelper.post({
      pathname: '/v1/auth/dev',
      args: { body: { email: `${registred}@test.com` } },
    });

    const json = (await res.json()) as any;

    const cookie = res.headers.getSetCookie() as any;
    const access_token = json['access_token'];

    return { access_token, cookie };
  };

  /**
   * 유저를 가져옵니다
   * @param auth
   * @returns
   */
  getUser = async () => {
    const auth = await this.signIn();

    const res = await this.request('/v1/users', {
      headers: { Authorization: `Bearer ${auth.access_token}`, cookie: auth.cookies },
      credentials: 'include',
    });

    const json = await res.json();

    return { auth, user: zGetUserRes.parse(json) };
  };

  /**
   * 유저를 가져옵니다
   * @param auth
   * @returns
   */
  getRegisteredUser = async () => {
    const auth = await this.signIn();

    const res = await this.request('/v1/users', {
      headers: { Authorization: `Bearer ${auth.access_token}`, cookie: auth.cookies },
      credentials: 'include',
    });

    await this.request('/v1/users', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        cookie: auth.cookies,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'registered user', gender: 'm' }),
      credentials: 'include',
    });

    const json = await res.json();
    return zGetUserRes.parse(json);
  };

  /**
   * jest의 test를 래핑한 함수
   * @param fn
   * @param optional
   */
  test(
    fn: (props: {
      api: ReturnType<typeof createAPIHelper>;
      fetch: InstanceType<typeof TestHelper>['fetch'];
      request: InstanceType<typeof TestHelper>['request'];
      signIn: InstanceType<typeof TestHelper>['signIn'];
      authDev: InstanceType<typeof TestHelper>['authDev'];
    }) => void | Promise<void>,

    optional?: { testName: string; timeout?: number | undefined }
  ) {
    const tesnFn = () =>
      fn({
        api: this.apiHelper,
        fetch: this.fetch,
        request: this.request,
        signIn: this.signIn,
        authDev: this.authDev,
      });

    jest.test(
      `${this.pathname}${optional?.testName ? `-${optional.testName}` : ''}`,
      tesnFn,
      optional?.timeout
    );
  }
}
