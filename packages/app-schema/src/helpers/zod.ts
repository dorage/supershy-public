import { z } from 'zod';

const json = <T extends z.ZodType>(type: T) =>
  z
    .string()
    .or(type)
    .transform<z.infer<T>>((arg) => (typeof arg !== 'string' ? arg : type.parse(JSON.parse(arg))));

export const _z = {
  json,
};
