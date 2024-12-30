import Tag from '@/src/constants/tags';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

export const zRes = z.object({ okay: z.boolean() });

type AdmobQuery = {
  ad_network: string;
  ad_unit: string;
  reward_amount: string;
  reward_item: string;
  timestamp: string;
  transaction_id: string;
  user_id: string;
  signature: string;
  key_id: string;
};

const route = createRoute({
  path: '',
  tags: [Tag.Hooks],
  method: 'get',
  summary: '',
  description: '',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: zRes,
        },
      },
      description: '',
    },
  },
  security: [{ Bearer: [] }],
});

const app = new OpenAPIHono();

app.use(route.getRoutingPath());

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const query = c.req.query() as AdmobQuery;

  return c.json(zRes.parse({ okay: true }));
});

export default app;
