import Tag from '@/src/constants/tags';
import { Ky } from '@/src/helpers/kysely';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { UserSchema } from 'app-schema';
import HonoAuth from 'hono-auth';

export const zJson = z.object({
  authorization_code: z.string(),
  identity_token: z.string(),
  email: z.string().email().nullable(),
  user: z.string(),
});

export const zRes = z.object({
  access_token: z.string(),
});

const route = createRoute({
  path: '',
  tags: [Tag.Auth],
  method: 'post',
  summary: 'Sign in with Apple',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({
            authorization_code: 'code',
            identity_token: 'token',
            email: 'tester@playplease.us',
            user: 'user',
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

  const user = await createOrInsertUser(json.email ?? json.user, json.user);

  const { accessToken } = await HonoAuth.useSignInHandler(c, { userId: user.id.toString() });

  return c.json({ access_token: accessToken });
});

const createOrInsertUser = async (email: string, apple: string) => {
  let user = await Ky.selectFrom('users')
    .selectAll()
    .where((eb) => eb('email', '=', email).or('apple', '=', apple))
    .executeTakeFirst();

  if (user == null) {
    await Ky.insertInto('users')
      .values({
        auth: JSON.stringify(
          UserSchema.shape.auth.parse({
            email: email,
            apple: apple,
          })
        ),
        vip: JSON.stringify(UserSchema.shape.vip.parse({ create: false, join: false })),
      })
      .execute();
    user = await Ky.selectFrom('users')
      .selectAll()
      .where((eb) => eb('email', '=', email).or('apple', '=', apple))
      .executeTakeFirstOrThrow();
  }

  return user;
};

export default app;
