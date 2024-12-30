import { PollAnswerSchema } from '@/src/db/poll-answers';
import { Ky } from '@/src/helpers/kysely';
import { IAP } from '@/src/v1/constants/iap';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({ poll_answer_id: PollAnswerSchema.shape.id });

app.put('/open', zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const json = c.req.valid('json');

  if (user.coin < IAP.open.coin) {
    throw new HTTPException(402);
  }

  await Ky.updateTable('poll_answers')
    .set({ is_checked: sql`true` })
    .where('id', '=', json.poll_answer_id)
    .where('winner_id', '=', user.id)
    .executeTakeFirstOrThrow();

  await Ky.updateTable('users')
    .set((eb) => ({
      coin: eb('coin', '-', IAP.open.coin),
    }))
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

export default app;
