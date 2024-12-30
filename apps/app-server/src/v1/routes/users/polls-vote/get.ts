import { PollAnswerSchema } from '@/src/db/poll-answers';
import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z
  .object({
    id: PollAnswerSchema.shape.id,
    poll: PollAnswerSchema.shape.poll,
    is_checked: PollAnswerSchema.shape.is_checked,
  })
  .array();

app.get(
  '/polls/vote',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender', 'nspn', 'grade'] }),
  async (c) => {
    const user = c.get('auth_userSchema');

    const pollAnswer = await Ky.selectFrom('poll_answers')
      .selectAll()
      .where('voter_id', '=', user.id)
      .where('winner_id', 'is not', null)
      .limit(30)
      .orderBy('created_at desc')
      .execute();

    return c.json(zRes.parse(pollAnswer));
  }
);

export default app;
