import HonoAuth from 'hono-auth';
import { createMiddleware } from 'hono/factory';

/**
 * middleware, validate token
 * set 'auth_payload' var
 * @param c
 * @param next
 * @returns
 */
export const useAuth = (refresh: boolean = false) => {
  return createMiddleware(async (c, next) => {
    const payload = await HonoAuth.useAuthHandler(c, refresh);

    c.set('auth_payload', payload);

    await next();
  });
};

/**
 * need 'useAuth'
 * @returns
 */
export const useSignIn = () => {
  return createMiddleware(async (c) => {
    const user = c.get('auth_userSchema');

    const { accessToken } = await HonoAuth.useSignInHandler(c, { userId: user.id.toString() });

    return c.json({ access_token: accessToken });
  });
};

/**
 * need 'useAuth'
 * @returns
 */
export const useRefresh = () => {
  return createMiddleware(async (c) => {
    const payload = c.get('auth_payload');

    const { accessToken } = await HonoAuth.useRefershHandler(c, payload);

    return c.json({ access_token: accessToken });
  });
};

/**
 * need 'useAuth'
 * @returns
 */
export const useLogout = () => {
  return createMiddleware(async (c) => {
    const payload = c.get('auth_payload');

    await HonoAuth.useLogoutHandler(c, payload);

    return c.json({ ok: true });
  });
};
