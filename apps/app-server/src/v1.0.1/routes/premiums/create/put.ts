import { Ky } from '@/src/helpers/kysely';
import { IAP } from '@/src/v1/constants/iap';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.put('/create', async (c) => {
  const user = c.get('auth_userSchema');

  if (user.coin < IAP.create.coin) {
    throw new HTTPException(402);
  }
  if (user.vip?.create) {
    throw new HTTPException(403, { message: 'you bought create alreaddy' });
  }

  await Ky.updateTable('users')
    .set((eb) => ({
      coin: eb('coin', '-', IAP.create.coin),
      vip: sql`JSON_SET(vip, '$.create', TRUE)`,
    }))
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

export default app;
