import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.get('/premium-poll', async (c) => {
  const pollAnswers = await Ky().selectFrom('poll_premiums').selectAll().execute();

  await Ky().destroy();
  return c.json(pollAnswers);
});

export default app;
