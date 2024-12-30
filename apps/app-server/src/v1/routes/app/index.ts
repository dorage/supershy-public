import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

import getHealth from './health/get';
app.route('', getHealth);

import postVersions from './versions/post';
app.route('', postVersions);

import getAdmob from './admob/get';
app.route('', getAdmob);

import postRevenuecat from './revenuecat/post';
app.route('', postRevenuecat);

export default app;
