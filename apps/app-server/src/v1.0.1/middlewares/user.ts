import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { UserSchema } from 'app-schema';

/**
 * middleware, validate token, fetch user
 * set 'auth_user' var
 * @returns
 */
export const useUser = () => {
  return createMiddleware<SuperShyEnv>(async (c, next) => {
    const { userId } = c.get('auth_payload');

    const user = await Ky.selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirstOrThrow();

    c.set('auth_userSchema', user);
    await next();
  });
};

/**
 * middleware, check user registration
 * need 'auth_payload' var
 * need 'auth_user' var
 * @returns
 */
export const useUserRegistered = (be: {
  null?: (keyof z.infer<typeof UserSchema>)[];
  fill?: (keyof z.infer<typeof UserSchema>)[];
}) => {
  return createMiddleware<SuperShyEnv>(async (c, next) => {
    const user = c.get('auth_userSchema');

    if (user == null) throw new HTTPException(401, { message: 'User is not exist' });

    if ((be.fill ?? []).some((column) => user[column] == null)) {
      throw new HTTPException(403, { message: 'Access Denied, some field is not exist' });
    }

    if ((be.null ?? []).some((column) => user[column] != null)) {
      throw new HTTPException(403, { message: 'Access Denied,, some field is not null' });
    }

    await next();
  });
};
