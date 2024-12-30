import { UserSchema, zUserAuth } from '@/src/db/users';
import { useDev } from '@/src/middlewares/dev';
import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { useSignIn } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<SuperShyEnv>();

export const zJson = z.object({
  email: z.string().email(),
});

export const zRes = z.object({
  access_token: z.string(),
});

app.post(
  '/dev',
  useDev(),
  zValidator('json', zJson),
  async (c, next) => {
    const { email } = c.req.valid('json');

    const user = UserSchema.parse(await createOrSelectUserKy(email));
    console.log('🚀 ~ file: post.ts:28 ~ user:', user);
    if (user == null) throw new HTTPException(401, { message: 'cannot create new user' });

    c.set('auth_userSchema', user);
    await next();
  },
  useSignIn()
);

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
