import { zResponse } from '@/src/helpers/zod';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser } from '@/src/v1.0.1/middlewares/user';
import { SchoolGroupSchema, UserSchema } from 'app-schema';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z.object({
  school: z.object({
    id: SchoolGroupSchema.shape.id,
    name: SchoolGroupSchema.shape.name,
    type: SchoolGroupSchema.shape.type,
  }),
  students: z
    .object({
      id: UserSchema.shape.id,
      name: UserSchema.shape.name,
      gender: UserSchema.shape.gender,
      phone: UserSchema.shape.phone,
    })
    .array(),
});

app.get(useAuth(), useUser(), async (c, next) => {
  const user = c.get('auth_userSchema');

  const school = await Ky.selectFrom('school_groups')
    .selectAll()
    .where('id', '=', user.school_group_id)
    .executeTakeFirst();
  const students = await Ky.selectFrom('users')
    .selectAll()
    .where('school_group_id', '=', user.school_group_id)
    .where('grade', '=', user.grade)
    .execute();

  return c.json(zRes.parse({ school, students }));
});

export default app;
