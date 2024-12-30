import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { useAuth } from '@/src/middlewares/auth';
import { useUser } from '@/src/v1/middlewares/user';
import { UserSchema } from '@/src/db/users';
import { Ky } from '@/src/helpers/kysely';

const app = new Hono<SuperShyEnv>();

export const zRes = z.object({
  id: UserSchema.shape.id,
  name: UserSchema.shape.name,
  grade: UserSchema.shape.grade,
  gender: UserSchema.shape.gender,
  coin: UserSchema.shape.coin,
  school: UserSchema.shape.school,
  vip: UserSchema.shape.vip,
});

app.get('/', useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  return c.json(zRes.parse(user));
});

export default app;
