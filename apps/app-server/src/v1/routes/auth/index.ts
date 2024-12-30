import { SuperShyEnv } from '@/src/globals';
import { Hono } from 'hono';
import postDev from './dev/post';
import postGoogle from './google/post';
import postApple from './apple/post';
import postRefresh from './refresh/post';
import postLogout from './logout/post';

const app = new Hono<SuperShyEnv>();

app.route('', postDev);
app.route('', postGoogle);
app.route('', postApple);
app.route('', postRefresh);
app.route('', postLogout);

export default app;
