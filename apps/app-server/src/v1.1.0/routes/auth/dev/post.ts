import Tag from '@/src/constants/tags';
import { Ky } from '@/src/helpers/kysely';
import { useDev } from '@/src/middlewares/dev';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { UserSchema } from 'app-schema';
import HonoAuth from 'hono-auth';
import { HTTPException } from 'hono/http-exception';

export const zJson = z.object({
  email: z.string().email(),
});

export const zRes = z.object({
  access_token: z.string(),
});

const route = createRoute({
  path: '',
  tags: [Tag.Auth],
  method: 'post',
  summary: '',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({ email: 'tester@playplease.us' }),
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
  security: [{ Bearer: [] }],
});

const app = new OpenAPIHono();

app.use(route.getRoutingPath(), useDev(), zValidator('json', zJson));

export type EndpointType = typeof ep;
export const ep = app.openapi(route, async (c) => {
  const json = c.req.valid('json');

  const user = UserSchema.parse(await createOrSelectUserKy(json.email));
  if (user == null) throw new HTTPException(401, { message: 'cannot create new user' });

  const { accessToken } = await HonoAuth.useSignInHandler(c, { userId: user.id.toString() });

  return c.json({ access_token: accessToken });
});

const selectUser = (email: string) =>
  Ky.selectFrom('users').selectAll().where('email', '=', email).executeTakeFirst();

const createUser = (email: string) =>
  Ky.insertInto('users')
    .values({
      auth: JSON.stringify(UserSchema.shape.auth.parse({ email })),
      vip: JSON.stringify(UserSchema.shape.vip.parse({ create: false, join: false })),
    })
    .executeTakeFirstOrThrow();

const createOrSelectUserKy = async (email: string) => {
  let user = await selectUser(email);
  console.log('🚀 ~ file: post.ts:50 ~ createOrSelectUserKy ~ user:', user);
  if (user == null) {
    await createUser(email);
    user = await selectUser(email);
    console.log('🚀 ~ file: post.ts:54 ~ createOrSelectUserKy ~ user:', user);
  }
  return user;
};

export default app;
