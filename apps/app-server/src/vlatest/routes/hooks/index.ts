import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

import getAdmob from './admob/get';
app.route('/admob', getAdmob);

import postRevenueCat from './revenue-cat/post';
app.route('/revenue-cat', postRevenueCat);

export default app;
