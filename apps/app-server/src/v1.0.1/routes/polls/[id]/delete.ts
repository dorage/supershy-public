import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { sql } from 'kysely';

const app = new Hono<SuperShyEnv>();

app.delete(useAuth(), async (c) => {
  const payload = c.get('auth_payload');
  const { id } = c.req.param();
  const pollAnswerId = id;

  await Ky.updateTable('poll_answers')
    .set({ winner: sql<string>`JSON_OBJECT()` })
    .where('id', '=', pollAnswerId)
    .where('voter_id', '=', payload.userId)
    .where('winner', 'is', null)
    .execute();

  return c.json({ okay: true });
});

export default app;
