import { IncomingRequestCfProperties } from '@cloudflare/workers-types';
import { BodyInit, Miniflare, RequestInit, Response } from 'miniflare';
import { URLHelper } from './url';

// API arguments
export interface APIArguments<TBody> {
  auth?: { access_token: string; cookie: string };
  params?: object;
  query?: object;
  body?: TBody;
}

interface CustomOptions<TBody> {
  // API endpoint pathname
  pathname: string;
  // API arguments
  args?: APIArguments<TBody>;
}

// API 옵션 타입
type APIOptions<TBody> = CustomOptions<TBody> &
  Omit<RequestInit<Partial<IncomingRequestCfProperties>>, 'url' | 'method' | 'body'>;

// api 함수
const APIHelper =
  (mf: Miniflare, method: 'GET' | 'POST' | 'PUT' | 'DELETE') =>
  async <TBody>(options: APIOptions<TBody>): Promise<Response> => {
    const url = URLHelper(options.pathname, options.args?.query).toString();

    const body = options.args?.body;
    const httpOptions: RequestInit<Partial<IncomingRequestCfProperties>> = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': body ? 'application/json' : '',
        // authorization
        Authorization: options.args?.auth ? `Bearer ${options.args.auth.access_token}` : '',
        cookie: options.args?.auth ? options.args.auth.cookie : '',
      },
      body: JSON.stringify(body),
      method,
    };

    return mf.dispatchFetch(url, httpOptions);
  };

export const createAPIHelper = (mf: Miniflare) => ({
  get: APIHelper(mf, 'GET'),
  post: APIHelper(mf, 'POST'),
  put: APIHelper(mf, 'PUT'),
  delete: APIHelper(mf, 'DELETE'),
});
