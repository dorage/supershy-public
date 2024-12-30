import { Ky } from '@/src/helpers/kysely';

import { SuperShyEnv } from '@/src/globals';
import { IAP } from '@/src/v1/constants/iap';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';

const app = new Hono<SuperShyEnv>();

app.put('/join', async (c) => {
  const user = c.get('auth_userSchema');

  if (user.coin < IAP.join.coin) {
    throw new HTTPException(402);
  }
  if (user.vip?.join) {
    throw new HTTPException(403, { message: 'you bought join alreaddy' });
  }

  await Ky.updateTable('users')
    .set((eb) => ({
      coin: eb('coin', '-', IAP.join.coin),
      vip: sql`JSON_SET(vip, '$.join', TRUE)`,
    }))
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

export default app;
