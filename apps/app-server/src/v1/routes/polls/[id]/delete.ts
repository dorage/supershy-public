import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.delete('/:id', async (c) => {
  const user = c.get('auth_userSchema');
  const { id } = c.req.param();
  const pollAnswerId = id;

  if (Number.isNaN(pollAnswerId)) {
    throw new HTTPException(404);
  }

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', pollAnswerId)
    .where('voter_id', '=', user.id)
    .executeTakeFirstOrThrow();

  if (pollAnswer?.winner_id != null) {
    throw new HTTPException(403);
  }

  await Ky.deleteFrom('poll_candidates').where('poll_answer_id', '=', pollAnswerId).execute();

  await Ky.deleteFrom('poll_answers')
    .where('id', '=', pollAnswerId)
    .where('voter_id', '=', user.id)
    .where('winner', 'is', null)
    .execute();

  return c.json({ okay: true });
});

export default app;
