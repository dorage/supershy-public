import { Ky } from '@/src/helpers/kysely';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import HonoAuth from 'hono-auth';
import { HTTPException } from 'hono/http-exception';

export const zJson = z.object({
  account_id: z.string(),
  password: z.string(),
});

export const zRes = z.object({
  access_token: z.string(),
});

const route = createRoute({
  path: '',
  tags: ['Auth'],
  method: 'post',
  summary: 'Sign in with id/password',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({
            account_id: '01000000000',
            password: '123123',
          }),
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

app.use(route.getRoutingPath(), zValidator('json', zJson));

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const json = c.req.valid('json');

  const user = await Ky.selectFrom('users')
    .selectAll()
    .where('account_id', '=', json.account_id)
    .executeTakeFirstOrThrow();

  // password 가 없는 경우
  if (user.password == null) throw new HTTPException(401, { message: 'invalid id/password' });
  // password가 일치하지 않는 경우
  if (!(await bcrypt.compare(json.password, user.password!)))
    throw new HTTPException(401, { message: 'invalid id/password' });

  const { accessToken } = await HonoAuth.useSignInHandler(c, {
    userId: user.id.toString(),
  });

  return c.json({ access_token: accessToken });
});

export default app;
