import { z } from '@hono/zod-openapi';
import { UserSchema } from 'app-schema';
import { Env } from 'hono';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MODE: 'development' | 'production';
      PACKAGE_NAME: string;
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
      APPLE_SIGN_IN_AUTH_KEY: string;
      JWT_ALGORITHM: string;
      JWT_SECRET: string;
    }
  }
}

export interface HonoVariables extends Env {
  auth_payload: JWTPayload;
  auth_userSchema: z.infer<typeof UserSchema>;
  auth_googleToken: string;
  res: any;
  zResponse: any;
}

export interface SuperShyEnv extends Env {
  Bindings: {
    MODE: 'development' | 'production';
    PACKAGE_NAME: string;
    COOKIE_REFRESH_TOKEN: string;
    SENTRY_DSN: string;
    GOOGLE_API_KEY: string;
    GOOGLE_API_CLIENT_ID: string;
    GOOGLE_API_CLIENT_SECRET: string;
    APPLE_CLIENT_ID: string;
    APPLE_SIGN_IN_KEY_ID: string;
    // secret vars
    JWT_ALGORITHM: 'HS256' | 'HS384' | 'HS512';
    JWT_SECRET: string;
    COOKIE_SECRET: string;

    DB: D1Database;
  };
  Variables: {
    auth_payload: JWTPayload;
    auth_userSchema: z.infer<typeof UserSchema>;
    auth_googleToken: string;
    res: any;
    zResponse: any;
  };
}
