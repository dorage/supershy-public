import { Ky } from '@/src/helpers/kysely';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { UserSchema } from 'app-schema';
import bcrypt from 'bcryptjs';

export const zJson = z.object({
  account_id: z.string(),
  password: z.string(),
});

export const zRes = z.object({
  okay: z.boolean(),
});

const route = createRoute({
  path: '',
  tags: ['Auth'],
  method: 'put',
  summary: 'Sign up with id/password',
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

  const hash = await bcrypt.hash(json.password, 10);

  const user = await Ky.selectFrom('users')
    .selectAll()
    .where('account_id', '=', json.account_id)
    .executeTakeFirst();

  if (user != null) return c.json({ okay: false });

  await Ky.insertInto('users')
    .values({
      auth: JSON.stringify(
        UserSchema.shape.auth.parse({
          account_id: json.account_id,
          password: hash,
        })
      ),
      vip: JSON.stringify(UserSchema.shape.vip.parse({ create: false, join: false })),
    })
    .execute();

  return c.json({ okay: true });
});

export default app;
