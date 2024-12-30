import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  sql: z.string(),
});

app.post('/sql', zValidator('json', zJson), async (c) => {
  const json = c.req.valid('json');

  await Ky().destroy();
  return c.json({ okay: true });
});

export default app;
