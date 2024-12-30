import { useAuth, useLogout } from '@/src/middlewares/auth';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.post('/logout', useAuth(), useLogout());

export default app;
