import { CitySchoolSchema } from '@/src/db/city-schools';
import { SchoolSchema } from '@/src/db/schools';
import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

export const zQuery = z.object({
  id: CitySchoolSchema.shape.id,
  type: SchoolSchema.shape.type,
});

export const zRes = z
  .object({
    nspn: SchoolSchema.shape.nspn,
    name: SchoolSchema.shape.name,
    city: CitySchoolSchema.shape.id,
  })
  .array();

app.get('/schools', useAuth(), zValidator('query', zQuery), async (c, next) => {
  const { id, type } = c.req.valid('query');

  //  it is the last level of cities
  if (id.slice(4, 6) == '00') {
    throw new HTTPException(404);
  }

  const citySchool = CitySchoolSchema.parse(
    await Ky.selectFrom('city_schools').selectAll().where('id', '=', id).executeTakeFirstOrThrow()
  );

  return c.json(zRes.parse(citySchool[type]));
});

export default app;
