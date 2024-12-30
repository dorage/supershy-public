import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, z } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { useConfigs } from './middlewares/configs';
import { useDev } from './middlewares/dev';
import { useEnv } from './middlewares/env';

import { JWTPayload } from 'hono-auth';
import { UserSchema } from 'app-schema';

import * as Sentry from '@sentry/node';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

declare module 'hono' {
  interface ContextVariableMap {
    auth_payload: JWTPayload;
    auth_userSchema: z.infer<typeof UserSchema>;
    auth_googleToken: string;
    res: any;
    zResponse: any;
  }
}

const app = new OpenAPIHono();

app.use('*', logger());
// cors
app.use(
  '*',
  cors({
    origin: (origin) => origin,
    credentials: true,
  })
);
app.use('*', useEnv());
app.use('*', useConfigs());

app.onError(async (err, c) => {
  if (process.env.MODE === 'production')
    Sentry.captureException({
      path: c.req.path,
      body: c.req.json,
      param: c.req.param,
      query: c.req.query,
      error: err,
    });
  console.error(c.req.method, c.req.path);
  console.error('[ERROR] ', err);
  console.error('[HEADER] ', c.req.header());
  console.error('[BODY] ', await c.req.json());

  if (err instanceof HTTPException) {
    throw err;
  }
  if (err instanceof ZodError) {
    throw err;
  }
  return c.text('Not found.', 404);
});

app.get('/', async (c) => {
  return c.json({ okay: true });
});

app.notFound(async (c) => {
  return c.text('Not found.', 404);
});

// register a securtiy component, OpenAPI
app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});
// The OpenAPI documentation will be available at /doc
app.use('/open-api', useDev());
app.doc('/open-api', {
  openapi: '3.0.0',
  info: {
    version: '1.1.0',
    title: 'Supershy API',
  },
});
// SwaggerUI
app.get('/doc', useDev(), swaggerUI({ url: '/open-api' }));

import vlatest from './vlatest';
app.route('/latest', vlatest);

import v1 from './v1';
app.route('/v1', v1);

import v101 from './v1.0.1';
app.route('/v1.0.1', v101);

import v110 from './v1.1.0';
app.route('/v1.1.0', v110);

import v111 from './v1.1.1';
app.route('/v1.1.1', v111);

export default app;
