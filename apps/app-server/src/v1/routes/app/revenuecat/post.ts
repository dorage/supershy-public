import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';

interface RevenueCatJSON {
  api_version: string;
  event: {
    type: 'INITIAL_PURCHASE' | 'CANCELLATION';
    app_id: string;
    app_user_id: string;
    product_id: string;
  };
}

const app = new Hono<SuperShyEnv>();

app.post('/revenuecat', async (c) => {
  const json = (await c.req.json()) as RevenueCatJSON;

  json.event.app_user_id;
  json.event.product_id;
  json.event.type;

  return c.json({ okay: true });
});

export default app;
