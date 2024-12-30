import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { zColumns } from '@/src/db/globals';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

app.put(
  '/',
  zValidator('json', zJson),
  useAuth(),
  useUser(),
  useUserRegistered({ null: ['name', 'gender'] }),
  async (c) => {
    const { gender, name } = c.req.valid('json');
    const user = c.get('auth_userSchema');

    await Ky.updateTable('users')
      .set({
        name,
        gender,
      })
      .where('id', '=', user.id)
      .execute();

    return c.json({ okay: true });
  }
);

export default app;
