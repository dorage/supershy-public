import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { PollAnswerSchema } from 'app-schema';
import { useAuth } from '@/src/middlewares/auth';

const app = new Hono<SuperShyEnv>();

const zUncheckedRes = z.object({
  id: PollAnswerSchema.shape.id,
  poll: PollAnswerSchema.shape.poll,
  winner: PollAnswerSchema.shape.winner,
  candidates: PollAnswerSchema.shape.candidates,
});

const zCheckedRes = z.object({
  id: PollAnswerSchema.shape.id,
  poll: PollAnswerSchema.shape.poll,
  voter: PollAnswerSchema.shape.voter,
  winner: PollAnswerSchema.shape.winner,
  candidates: PollAnswerSchema.shape.candidates,
});

app.get(useAuth(), async (c) => {
  const { id } = c.req.param();
  const payload = c.get('auth_payload');
  const pollAnswerId = id;

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', pollAnswerId)
    .where('winner', 'is not', null)
    .executeTakeFirstOrThrow();

  if (pollAnswer.is_checked && pollAnswer.winner_id === payload.userId) {
    return c.json(zCheckedRes.parse(pollAnswer));
  }

  return c.json(zUncheckedRes.parse(pollAnswer));
});

export default app;
