import Tag from '@/src/constants/tags';
import { useAuth } from '@/src/middlewares/auth';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import HonoAuth from 'hono-auth';

export const zRes = z.object({ okay: z.boolean() });

const route = createRoute({
  path: '',
  tags: [Tag.Auth],
  method: 'post',
  summary: 'Terminate refresh token',
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

app.use(route.getRoutingPath(), useAuth());

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const payload = c.get('auth_payload');

  await HonoAuth.useLogoutHandler(c, payload);

  return c.json(zRes.parse({ okay: true }));
});

export default app;
