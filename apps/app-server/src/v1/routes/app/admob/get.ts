import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { Ky } from '@/src/helpers/kysely';

const app = new Hono<SuperShyEnv>();

type AdmobQuery = {
  ad_network: string[];
  ad_unit: string[];
  reward_amount: string[];
  reward_item: string[];
  timestamp: string[];
  transaction_id: string[];
  user_id: string[];
  signature: string[];
  key_id: string[];
};

app.get('/admob', async (c) => {
  console.log('GET');
  console.log(c.req.queries());
  const query = c.req.queries() as AdmobQuery;

  const userId = query.user_id[0];

  const user = await Ky.selectFrom('users')
    .selectAll()
    .where('id', '=', Number(userId))
    .executeTakeFirstOrThrow();

  const reward = randomCoin();

  await Ky.updateTable('users')
    .set((eb) => ({ coin: eb('coin', '+', randomCoin()) }))
    .where('id', '=', Number(userId))
    .execute();

  return c.json({ okay: true });
});

const random = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const randomCoin = () => {
  const rand = random(50);

  // 100 coin = 1%
  // 99 ~ 90 3%
  // 90 ~ 80 3%
  // 80 ~ 70 3%
  // 70 ~ 60 3%
  // 60 ~ 50 3%
  // 50 ~ 30 10%
  // 30 ~ 10 etc
  if (rand >= 99) return 100;
  if (rand >= 96) return random(100, 90);
  if (rand >= 93) return random(90, 80);
  if (rand >= 90) return random(80, 70);
  if (rand >= 87) return random(70, 60);
  if (rand >= 84) return random(60, 50);
  if (rand >= 74) return random(50, 30);
  return random(30, 10);
};

export default app;
