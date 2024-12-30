import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
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

import getStudents from './students/get';
app.route('', getStudents);

export default app;
