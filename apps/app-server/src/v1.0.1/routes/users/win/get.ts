import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser } from '@/src/v1/middlewares/user';
import { PollAnswerSchema } from 'app-schema';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z
  .object({
    id: PollAnswerSchema.shape.id,
    poll: PollAnswerSchema.shape.poll,
    is_checked: PollAnswerSchema.shape.is_checked,
  })
  .array();

app.get(useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('winner_phone', '=', user.phone)
    .limit(30)
    .orderBy('created_at desc')
    .execute();

  return c.json(zRes.parse(pollAnswer));
});

export default app;
