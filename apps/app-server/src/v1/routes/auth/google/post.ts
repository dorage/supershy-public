import { UserSchema } from '@/src/db/users';
import { SuperShyEnv } from '@/src/globals';
import GoogleHelper from '@/src/helpers/google';
import { Ky } from '@/src/helpers/kysely';
import { useSignIn } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  code: z.string(),
});

app.post(
  '/google',
  zValidator('json', zJson),
  async (c, next) => {
    const json = c.req.valid('json');

    // Reference
    // https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko#exchange-authorization-code
    const token = await GoogleHelper.getUserToken(json.code);
    const profile = await GoogleHelper.getProfile(token.access_token);

    const user = await createOrInsertUser(profile.email, token.refresh_token);

    c.set('auth_userSchema', user);
    await next();
  },
  useSignIn()
);

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
