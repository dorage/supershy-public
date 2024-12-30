import { Ky } from '@/src/helpers/kysely';
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { zValidator } from '@hono/zod-validator';
import { HTTPException } from 'hono/http-exception';

export const zJson = z.object({
  account_id: z.string(),
});

export const zRes = z.object({
  okay: z.boolean(),
});

const route = createRoute({
  path: '',
  tags: ['Auth'],
  method: 'post',
  summary: 'Check for duplicate IDs',
  description: '',
  request: {
    body: {
      content: {
        'application/json': {
          schema: zJson,
          example: zJson.parse({
            account_id: 'dorage',
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
    .select('id')
    .where('account_id', '=', json.account_id)
    .executeTakeFirst();

  if (user) throw new HTTPException(404, { message: 'already exists' });

  return c.json({ okay: true });
});

export default app;
