import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

import getBase from './base/get';
app.route('', getBase);
import getSchool from './schools/get';
app.route('', getSchool);

export default app;
