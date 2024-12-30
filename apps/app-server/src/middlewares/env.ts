import { createMiddleware } from 'hono/factory';

export const useEnv = () => {
  return createMiddleware(async (c, next) => {
    c.env = process.env;

    await next();
  });
};
