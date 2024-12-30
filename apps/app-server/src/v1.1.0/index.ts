import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

import auth from './routes/auth';
app.route('/auth', auth);

export default app;
