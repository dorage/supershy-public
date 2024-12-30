import { createMiddleware } from 'hono/factory';
import { SuperShyEnv } from '../globals';
import { HTTPException } from 'hono/http-exception';

export const useDev = () => {
  return createMiddleware<SuperShyEnv>(async (c, next) => {
    if (process.env.MODE === 'production') {
      throw new HTTPException(404, { message: 'Not found.' });
    }
    await next();
  });
};
