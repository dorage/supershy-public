import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

import admob from './routes/admob';
app.route('/admob', admob);

import premiums from './routes/premiums';
app.route('/premiums', premiums);

import univCities from './routes/univ-cities';
app.route('/univ-cities', univCities);

import univs from './routes/univs';
app.route('/univs', univs);

import users from './routes/users';
app.route('/users', users);

export default app;
