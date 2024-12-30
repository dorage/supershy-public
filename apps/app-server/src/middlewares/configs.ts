import * as Sentry from '@sentry/node';
import HonoAuth from 'hono-auth';
import { createMiddleware } from 'hono/factory';
import * as crypto from 'node:crypto';
import { Ky } from '../helpers/kysely';
import moment from 'moment';

export const useConfigs = () => {
  return createMiddleware(async (c, next) => {
    // initialize Sentry
    Sentry.init({
      dsn: 'https://5c4760d6747622613d5f09456445b360@o4506359651696640.ingest.sentry.io/4506382309457920',
      integrations: [],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
      environment: process.env.MODE,
    });
    // intialize Hono-Auth
    HonoAuth.initialize({
      jwt: {
        secret: process.env.JWT_SECRET,
        algorithm: 'HS256',
        accessExpiry: moment().utc(false).add(180, 'd').toISOString(),
        refreshExpiry: moment().utc(false).add(360, 'd').toISOString(),
      },
      hook: {
        createUniqueId() {
          return crypto.randomUUID();
        },
        async insertTerminatedJWT(payload) {
          try {
            await Ky.insertInto('jwts')
              .values({
                id: payload.iat,
                expired_at: payload.exp.toDate(),
              })
              .execute();
            return true;
          } catch (err) {
            console.error(err);
            return false;
          }
        },
        async selectTerminatedJWT(payload) {
          try {
            await Ky.selectFrom('jwts')
              .selectAll()
              .where('id', '=', payload.iat)
              .executeTakeFirstOrThrow();
            return true;
          } catch (err) {
            console.error(err);
            return false;
          }
        },
      },
      cookie: {
        key: process.env.COOKIE_REFRESH_TOKEN,
        secret: process.env.COOKIE_SECRET,
      },
    });

    await next();
  });
};
