import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z.object({});

app.get(
  '/polls/vote/count',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender', 'nspn', 'grade'] }),
  async (c) => {
    const user = c.get('auth_userSchema');

    const pollAnswer = await Ky.selectFrom('poll_answers')
      .select(({ fn }) => [fn.count<number>('id').as('count')])
      .where('voter_id', '=', user.id)
      .where('winner_id', 'is not', null)
      .executeTakeFirstOrThrow();

    return c.json(pollAnswer);
  }
);

export default app;
