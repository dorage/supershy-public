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

import putBuy from './buy/put';
app.route('', putBuy);

import putOpen from './open/put';
app.route('', putOpen);

import getJoin from './join/get';
app.route('', getJoin);

import putJoin from './join/put';
app.route('', putJoin);

import postJoin from './join/post';
app.route('', postJoin);

import putCreate from './create/put';
app.route('', putCreate);

import postCreate from './create/post';
app.route('', postCreate);

export default app;
