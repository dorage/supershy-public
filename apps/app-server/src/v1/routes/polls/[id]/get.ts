import { PollAnswerSchema } from '@/src/db/poll-answers';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zUncheckedRes = z.object({
  id: PollAnswerSchema.shape.id,
  poll: PollAnswerSchema.shape.poll,
  winner: PollAnswerSchema.shape.winner,
});

const zCheckedRes = z.object({
  id: PollAnswerSchema.shape.id,
  poll: PollAnswerSchema.shape.poll,
  voter: PollAnswerSchema.shape.voter,
  winner: PollAnswerSchema.shape.winner,
});

app.get('/:id', async (c) => {
  const { id } = c.req.param();
  const user = c.get('auth_userSchema');
  const pollAnswerId = id;

  if (Number.isNaN(pollAnswerId)) {
    throw new HTTPException(404);
  }

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', pollAnswerId)
    .where('winner', 'is not', null)
    .executeTakeFirstOrThrow();

  if (pollAnswer.is_checked && pollAnswer.winner_id === user.id) {
    return c.json(zCheckedRes.parse(pollAnswer));
  }

  return c.json(zUncheckedRes.parse(pollAnswer));
});

export default app;
