import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

import hooks from './routes/hooks';
app.route('hooks', hooks);

export default app;
