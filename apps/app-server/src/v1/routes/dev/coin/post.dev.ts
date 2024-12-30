import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { useUser } from '@/src/v1/middlewares/user';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.post('/coin', useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  await Ky.updateTable('users')
    .set((eb) => ({ coin: eb('coin', '+', 95) }))
    .where('id', '=', user.id)
    .executeTakeFirstOrThrow();

  return c.json({ okay: true });
});

export default app;
