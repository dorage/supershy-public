import { SuperShyEnv } from '@/src/globals';
import { Ky } from '@/src/helpers/kysely';
import { IAPConsumableReward } from '@/src/v1/constants/iap';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  transaction_id: z.string(),
  product_id: z.string(),
});

app.put('/buy', zValidator('json', zJson), async (c) => {
  const json = c.req.valid('json');
  const user = c.get('auth_userSchema');

  const iap = await Ky.selectFrom('user_iaps')
    .selectAll()
    .where('transaction_id', '=', json.transaction_id)
    .where('user_id', '=', user.id)
    .executeTakeFirst();

  if (iap != null) throw new HTTPException(403, { message: 'transaction is exists already' });

  // update coin
  await Ky.updateTable('users')
    .set((eb) => ({
      coin: eb('coin', '+', IAPConsumableReward[json.product_id] ?? 0),
    }))
    .where('id', '=', user.id)
    .execute();
  // update iap table
  await Ky.insertInto('user_iaps')
    .values({ user_id: user.id, product_id: json.product_id, transaction_id: json.transaction_id })
    .execute();

  return c.json({ okay: true });
});

export default app;
