import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';
import { zRes } from './post';

const testHelper = new TestHelper('/v1/auth/refresh');

describe('/v1/auth/refresh', () => {
  testHelper.test(async ({ fetch, signIn, api, authDev }) => {
    const auth = await authDev(0);
    const res = await api.post({
      pathname: '/v1/auth/refresh',
      args: { auth },
    });

    expect(res.status).toBe(200);

    const json = await res.json();
    const { success } = zRes.safeParse(json);
    expect(success).toBe(true);

    // expired된 토큰으로 리프레쉬 불가능

    const res2 = await api.post({
      pathname: '/v1/auth/refresh',
      args: { auth },
    });

    expect(res2.status).toBe(401);
  });
});
