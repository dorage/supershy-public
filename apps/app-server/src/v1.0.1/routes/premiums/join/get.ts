import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.get('/join', async (c) => {
  const user = c.get('auth_userSchema');

  const polls = await Ky.selectFrom('polls')
    .selectAll()
    .where('gender', '!=', user.gender === 'm' ? 'f' : 'm')
    .execute();

  return c.json(polls);
});

export default app;
