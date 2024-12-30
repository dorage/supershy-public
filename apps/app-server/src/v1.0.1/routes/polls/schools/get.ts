import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser } from '@/src/v1.0.1/middlewares/user';

import { PollAnswerSchema } from 'app-schema';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z
  .object({
    id: PollAnswerSchema.shape.id,
    poll: PollAnswerSchema.shape.poll,
    winner: PollAnswerSchema.shape.winner,
  })
  .array();

app.get(useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  const polls = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('school_group_id', '=', user.school_group_id)
    .where('winner', 'is not', null)
    .orderBy('updated_at desc')
    .limit(40)
    .execute();
  console.log('🚀 ~ file: get.ts:28 ~ app.get ~ polls:', polls);

  return c.json(zRes.parse(polls));
});

export default app;
