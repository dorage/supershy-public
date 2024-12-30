import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { zValidator } from '@hono/zod-validator';
import { UserSchema } from 'app-schema';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  grade: UserSchema.shape.grade,
});

app.use(
  '*',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender', 'school_group_id'], null: ['grade'] })
);

app.put(zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const json = c.req.valid('json');

  // update user grade
  await Ky.updateTable('users').set({ grade: json.grade }).where('id', '=', user.id).execute();

  return c.json({ okay: true });
});

export default app;
