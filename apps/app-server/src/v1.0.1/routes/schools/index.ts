import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

import getBase from './base/get';
app.route('/', getBase);

export default app;
