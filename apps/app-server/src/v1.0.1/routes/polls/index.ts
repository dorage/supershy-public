import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

import getBase from './base/get';
app.route('/', getBase);

import getSchools from './schools/get';
app.route('/schools', getSchools);

import getId from './[id]/get';
app.route('/:id', getId);

import deleteId from './[id]/delete';
app.route('/:id', deleteId);

import putId from './[id]/put';
app.route('/:id', putId);

export default app;
