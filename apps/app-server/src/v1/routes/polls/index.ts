import { SuperShyEnv } from '@/src/globals';
import { Hono } from 'hono';
import { useAuth } from '../../../middlewares/auth';
import { useUser, useUserRegistered } from '../../middlewares/user';

const app = new Hono<SuperShyEnv>();

app.use(
  '*',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender', 'nspn', 'grade'] })
);

import getBase from './base/get';
app.route('', getBase);

import getSchools from './schools/get';
app.route('', getSchools);

import getId from './[id]/get';
app.route('', getId);

import putId from './[id]/put';
app.route('', putId);

import deleteId from './[id]/delete';
app.route('', deleteId);

import getIdCandiates from './[id]-candidates/get';
app.route('', getIdCandiates);

import putIdCandiates from './[id]-candidates/put';
app.route('', putIdCandiates);

export default app;
