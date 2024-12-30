import { AppHealthSchema } from '@/src/db/app-health';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z.object({
  is_enabled: AppHealthSchema.shape.is_enabled,
});

app.get('/health', async (c) => {
  const appHealth = await Ky.selectFrom('app_health').selectAll().executeTakeFirst();

  if (appHealth == null) throw new HTTPException(500, { message: 'error' });

  return c.json(zRes.parse(appHealth));
});

export default app;
