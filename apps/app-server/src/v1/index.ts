/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { OpenAPIHono } from '@hono/zod-openapi';
import { useDev } from '../middlewares/dev';

const hono = new OpenAPIHono();

import dev from './routes/dev/index.dev';
hono.use('/dev', useDev());
hono.route('/dev', dev);

import app from './routes/app';
hono.route('/app', app);

import auth from './routes/auth';
hono.route('/auth', auth);

import users from './routes/users';
hono.route('/users', users);

import schools from './routes/schools';
hono.route('/schools', schools);

import cities from './routes/cities';
hono.route('/cities', cities);

import polls from './routes/polls';
hono.route('/polls', polls);

import premiums from './routes/premiums';
hono.route('/premiums', premiums);

export default hono;
