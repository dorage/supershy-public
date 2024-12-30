import StorageKeys from '@/constants/storage';
import { getPlatform, platformHelper } from '@/helpers/capacitor';
import Storage from '@/helpers/storage';
import AuthRepository from '@/repositories/auth';
import { CapacitorHttp, HttpOptions } from '@capacitor/core';

// API arguments
export interface APIArguments {
  params?: object;
  query?: object;
  body?: object;
}

interface CustomOptions {
  // API endpoint pathname
  pathname: string;
  // API arguments
  args?: APIArguments;
  // API Options Headers의 Authorization 관련 타입
  authorization?: boolean;
}

// API 옵션 타입
type APIOptions = CustomOptions & Omit<HttpOptions, 'url' | 'method' | 'data'>;

/**
 * url helper
 * @param pathname
 * @returns
 */

export const URLHelper = (pathname: string, query?: object) => {
  const host = platformHelper({
    web: () => import.meta.env.VITE_API_SERVER_HOST,
    android: () => import.meta.env.VITE_API_SERVER_HOST_NGROK,
    ios: () => import.meta.env.VITE_API_SERVER_HOST_NGROK,
  }) as string;

  const url = new URL(host);
  url.pathname = pathname;

  if (query == null) return url;

  const keys = Object.keys(query) as Array<keyof typeof query>;

  for (const key of keys) {
    if (query[key] == null) continue;
    url.searchParams.append(`${key}`, `${query[key]}`);
  }

  return url;
};

// api 함수
const APIHelper =
  (method: 'GET' | 'POST' | 'PUT' | 'DELETE') =>
  async <TData>(options: APIOptions): Promise<TData> => {
    const url = URLHelper(options.pathname, options.args?.query).toString();
    const data = options.args?.body;
    const token = await Storage.getItem(StorageKeys.accessToken);
    const httpOptions: HttpOptions = {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': data ? 'application/json' : '',
        // authorization 이 체크되어 있다면, 자동으로 토큰을 집어넣습니다
        Authorization: options.authorization ? `Bearer ${token}` : '',
      },
      data,
      method,
      url,
      webFetchExtra: {
        credentials: 'include',
      },
      readTimeout: 20 * 1000,
      connectTimeout: 20 * 1000,
    };

    if (getPlatform() === 'web') {
      console.groupCollapsed(`FETCH : [${method.toUpperCase()}] ${url}`);
      console.log(httpOptions);
      console.groupEnd();
    }

    const response = await CapacitorHttp.request(httpOptions);
    const body = response.data as TData;

    if (getPlatform() === 'web') {
      console.groupCollapsed(`RESULT : [${method.toUpperCase()}] ${url}`);
      console.log(`[${response.status}]`);
      console.log(response.data);
      console.groupEnd();
    }

    if (response.status !== 200) {
      // TODO; 401 에러; refresh 시도
      if (response.status === 401) {
        await AuthRepository.signOut();
      }
      throw Error(`[${response.status} - ${response.url}]: ${response.data}`);
    }

    return body;
  };

const API = {
  get: APIHelper('GET'),
  post: APIHelper('POST'),
  put: APIHelper('PUT'),
  delete: APIHelper('DELETE'),
};

export default API;
