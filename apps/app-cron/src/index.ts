import './libs/dotenv';
import './libs/sentry';

import * as Sentry from '@sentry/node';
import { sql } from 'kysely';
import CronHelper from './helpers/cron';
import { createKysely } from './libs/kysely';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MODE: 'development' | 'production';
      MYSQL_DATABASE: string;
      MYSQL_HOST: string;
      MYSQL_USER: string;
      MYSQL_PASSWORD: string;
      MYSQL_PORT: number;
      MYSQL_CA: string;
      COOKIE_SECRET: string;
      COOKIE_REFRESH_TOKEN: string;
      SENTRY_DSN: string;
      GOOGLE_API_KEY: string;
      GOOGLE_API_CLIENT_ID: string;
      GOOGLE_API_CLIENT_SECRET: string;
      APPLE_CLIENT_ID: string;
      APPLE_SIGN_IN_KEY_ID: string;
      JOSE_SECRET_KEY: string;
      JWT_ALGORITHM: string;
      JWT_SECRET: string;
    }
  }
}

console.log('START SCHEDULING');

/**
 * CRON
 *
 * 1. poll_today view를 생성
 * 2. winner 가 null 인 poll_answers row를 삭제
 *
 */

CronHelper.schedule({
  quartz: { development: '* * * 1 * *', production: '0 0 7 * * *' },
  func: async () => {
    console.log('CRON START');
    Sentry.setTag('environment', process.env.MODE);
    const kysely = createKysely(process.env.MODE);

    try {
      await sql`CREATE OR REPLACE VIEW poll_today AS SELECT * FROM polls ORDER BY RAND() LIMIT 10`.execute(
        kysely
      );

      Sentry.captureMessage('poll_today has created well!');
    } catch (err) {
      console.error(err);
      Sentry.configureScope(function (scope) {
        scope.setLevel('fatal');
        Sentry.captureException(err);
      });
    }

    try {
      await kysely.deleteFrom('poll_answers').where('winner', 'is', null).execute();

      Sentry.captureMessage('unvoted poll_answers has been deleted well!');
    } catch (err) {
      console.error(err);
      Sentry.configureScope(function (scope) {
        scope.setLevel('error');
        Sentry.captureException(err);
      });
    }

    try {
      await sql`DELETE FROM shorten_urls su WHERE TIMESTAMPDIFF(DAY, created_at, NOW()) > 7`.execute(
        kysely
      );

      Sentry.captureMessage('old shorten_url has been deleted well!');
    } catch (err) {
      console.error(err);
      Sentry.configureScope(function (scope) {
        scope.setLevel('error');
        Sentry.captureException(err);
      });
    }

    console.log('CRON END');
  },
  options: { utcOffset: 0 },
});

console.log('DONE SCHEDULING');
