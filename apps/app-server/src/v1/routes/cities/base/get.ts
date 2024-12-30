import { useAuth } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { CitySchema } from '@/src/db/cities';
import { Ky } from '@/src/helpers/kysely';

const app = new Hono<SuperShyEnv>();

export const zQuery = z.object({
  id: CitySchema.shape.id.optional(),
});

export const zRes = z
  .object({
    id: CitySchema.shape.id,
    name: CitySchema.shape.name,
  })
  .array();

app.get('/', useAuth(), zValidator('query', zQuery), async (c) => {
  const { id } = c.req.valid('query');

  //  it is the last level of cities
  if (id && id.slice(4, 6) != '00') {
    return c.json([]);
  }

  const city = await Ky.selectFrom('cities')
    .selectAll()
    .where('id', '=', id ?? ''.padEnd(6, '0'))
    .executeTakeFirstOrThrow();

  if (city == null) return c.json([]);

  return c.json(zRes.parse(city.children));
});

export default app;
