import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.post('/migration', async (c) => {
  await Ky.updateTable('users')
    .set({ vip: JSON.stringify({ join: false, create: false }) })
    .execute();

  return c.json({ okay: true });
});

export default app;
