import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { useUser } from '@/src/v1.0.1/middlewares/user';
import { UserSchema } from 'app-schema';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

export const zRes = z.object({
  id: UserSchema.shape.id,
  name: UserSchema.shape.name,
  grade: UserSchema.shape.grade,
  gender: UserSchema.shape.gender,
  coin: UserSchema.shape.coin,
  vip: UserSchema.shape.vip,
  phone: UserSchema.shape.phone,
  school_group_id: UserSchema.shape.school_group_id,
});

app.get(useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  return c.json(zRes.parse(user));
});

export default app;
