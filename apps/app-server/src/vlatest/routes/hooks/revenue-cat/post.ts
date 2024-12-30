import Tag from '@/src/constants/tags';
import { RevenueCatHookBody } from '@/src/helpers/revenue-cat';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';

export const zJson = z.object({});

export const zRes = z.object({ type: z.string() });

const route = createRoute({
  path: '',
  tags: [Tag.Hooks],
  method: 'post',
  summary: 'revenuecat hook',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({}),
        },
      },
      required: true,
    },
  },
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
});

const app = new OpenAPIHono();

app.use(route.getRoutingPath());

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const json = (await c.req.json()) as RevenueCatHookBody;

  if (json.event.type === 'INITIAL_PURCHASE') {
    // add record to premium_histories
  } else if (json.event.type === 'CANCELLATION') {
    // add record to premium_histories
  } else if (json.event.type === 'TEST') {
    // ignore
  } else {
    throw new HTTPException(404);
  }

  return c.json({ type: json.event.type });
});

export default app;
