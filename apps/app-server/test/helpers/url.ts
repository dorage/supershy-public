/**
 * url helper
 * @param pathname
 * @returns
 */

export const URLHelper = (pathname: string, query?: object) => {
  const host = 'http://127.0.0.1:9090';

  const url = new URL(host);
  url.pathname = pathname;

  if (query == null) return url;

  const keys = Object.keys(query) as Array<keyof typeof query>;

  for (const key of keys) {
    if (query[key] == null) continue;
    url.searchParams.append(`${key}`, `${query[key]}`);
  }

  return url.href;
};
