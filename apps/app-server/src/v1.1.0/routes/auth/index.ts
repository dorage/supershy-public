import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

import postDev from './dev/post';
app.route('/dev', postDev);

import postId from './id/post';
app.route('/id', postId);

import putPassword from './password/put';
app.route('/password', putPassword);

import postPassword from './password/post';
app.route('/password', postPassword);

import postGoogle from './google/post';
app.route('/google', postGoogle);

import postApple from './apple/post';
app.route('/apple', postApple);

import postRefresh from './refresh/post';
app.route('/refresh', postRefresh);

import postLogout from './logout/post';
app.route('/logout', postLogout);

export default app;
