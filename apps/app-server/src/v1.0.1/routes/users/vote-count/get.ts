import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser } from '@/src/v1/middlewares/user';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z.object({});

app.get(useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .where('voter_id', '=', user.id)
    .where('winner_phone', 'is not', null)
    .executeTakeFirstOrThrow();

  return c.json(pollAnswer);
});

export default app;
