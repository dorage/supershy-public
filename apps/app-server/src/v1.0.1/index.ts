import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

import _app from './routes/app';
app.route('/app', _app);

import polls from './routes/polls';
app.route('/polls', polls);

import premiums from './routes/premiums';
app.route('/premiums', premiums);

import schools from './routes/schools';
app.route('/schools', schools);

import users from './routes/users';
app.route('/users', users);

export default app;
