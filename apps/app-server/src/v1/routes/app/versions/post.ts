import { AppVersionSchema } from '@/src/db/app-versions';
import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { Kysely } from 'kysely';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  os: AppVersionSchema.shape.os,
  version: AppVersionSchema.shape.version,
});

const zRes = z.object({
  is_enabled: AppVersionSchema.shape.is_enabled,
});

app.post('/version', zValidator('json', zJson), async (c) => {
  const json = c.req.valid('json');

  const version = await Ky.selectFrom('versions')
    .selectAll()
    .where('os', '=', json.os)
    .where('version', '=', json.version)
    .executeTakeFirst();

  if (version == null) throw new HTTPException(500, { message: 'cannot find the version' });

  return c.json(zRes.parse(version));
});

export default app;
