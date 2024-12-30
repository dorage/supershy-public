import { useAuth, useRefresh } from '@/src/middlewares/auth';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

export const zRes = z.object({ accessToken: z.string() });

app.post('/refresh', useAuth(), useRefresh());

export default app;
