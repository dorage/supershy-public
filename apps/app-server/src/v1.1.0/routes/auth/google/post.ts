import Tag from '@/src/constants/tags';
import GoogleHelper from '@/src/helpers/google';
import { Ky } from '@/src/helpers/kysely';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { UserSchema } from 'app-schema';
import HonoAuth from 'hono-auth';

export const zJson = z.object({
  code: z.string(),
});

export const zRes = z.object({
  access_token: z.string(),
});

const route = createRoute({
  path: '',
  tags: [Tag.Auth],
  method: 'post',
  summary: 'Sign in with Google',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({
            code: 'code',
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

  const token = await GoogleHelper.getUserToken(json.code);
  const profile = await GoogleHelper.getProfile(token.access_token);

  const user = await createOrInsertUser(profile.email, token.refresh_token);

  const { accessToken } = await HonoAuth.useSignInHandler(c, { userId: user.id.toString() });

  return c.json({ access_token: accessToken });
});

const createOrInsertUser = async (email: string, refreshToken: string) => {
  let user = await Ky.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();
  if (user == null) {
    await Ky.insertInto('users')
      .values({
        auth: JSON.stringify(
          UserSchema.shape.auth.parse({
            email: email,
            google_refresh: refreshToken,
          })
        ),
        vip: JSON.stringify(UserSchema.shape.vip.parse({ create: false, join: false })),
      })
      .execute();

    user = await Ky.selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirstOrThrow();
  }

  return user;
};

export default app;
