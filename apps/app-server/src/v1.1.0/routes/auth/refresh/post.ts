import Tag from '@/src/constants/tags';
import { useAuth } from '@/src/middlewares/auth';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import HonoAuth from 'hono-auth';

export const zRes = z.object({
  access_token: z.string(),
});

const route = createRoute({
  path: '',
  tags: [Tag.Auth],
  method: 'post',
  summary: 'Refresh tokens',
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

app.use(route.getRoutingPath(), useAuth(true));

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const paylaod = c.get('auth_payload');

  const { accessToken } = await HonoAuth.useRefershHandler(c, paylaod);

  return c.json({ access_token: accessToken });
});

export default app;
