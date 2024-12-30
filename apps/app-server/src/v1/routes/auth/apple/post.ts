import { UserSchema } from '@/src/db/users';
import { SuperShyEnv } from '@/src/globals';
import { Ky } from '@/src/helpers/kysely';
import { useSignIn } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  authorization_code: z.string(),
  identity_token: z.string(),
  email: z.string().nullable(),
  user: z.string(),
});

app.post(
  '/apple',
  zValidator('json', zJson),
  async (c, next) => {
    const json = c.req.valid('json');

    const user = await createOrInsertUser(json.email ?? json.user, json.user);

    c.set('auth_userSchema', user);
    await next();
  },
  useSignIn()
);

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
