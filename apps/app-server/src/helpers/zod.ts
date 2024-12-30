import { createMiddleware } from 'hono/factory';
import { z } from 'zod';

const json = <T extends z.ZodType>(type: T) =>
  z
    .string()
    .or(type)
    .transform<z.infer<T>>((arg) => (typeof arg !== 'string' ? arg : type.parse(JSON.parse(arg))));

export const _z = {
  json,
};

export const zResponse = (z: z.ZodType) => {
  return createMiddleware(async (c) => {
    const res = c.get('response');
    return c.json(z.parse(res));
  });
};
