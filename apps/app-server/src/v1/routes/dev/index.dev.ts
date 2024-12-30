import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

import postSql from './sql/post.dev';
app.route('', postSql);

import postCoin from './coin/post.dev';
app.route('', postCoin);

import postMigration from './migration/post.dev';
app.route('', postMigration);

import postMock from './mock/post.dev';
app.route('', postMock);

import getPremiumPoll from './premium-poll/get.dev';
app.route('', getPremiumPoll);

import deleteTodayPoll from './today-poll/delete.dev';
app.route('', deleteTodayPoll);

import getNotify from './notification/get.dev';
app.route('', getNotify);

export default app;
