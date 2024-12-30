import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

import getPollId from './polls-id/get';
app.route('/polls/:id', getPollId);

export default app;
