import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

import getUsers from './base/get';
app.route('/', getUsers);

import putGrade from './grade/put';
app.route('/grade', putGrade);

import postPhoneVerify from './phone-verify/post';
app.route('/phone/verify', postPhoneVerify);

import putPhoneVerify from './phone-verify/put';
app.route('/phone/verify', putPhoneVerify);

import putSchools from './schools/put';
app.route('/schools', putSchools);

import getVote from './vote/get';
app.route('/vote', getVote);

import getVoteCount from './vote-count/get';
app.route('/vote/count', getVoteCount);

import getWin from './win/get';
app.route('/win', getWin);

import getWinCount from './win-count/get';
app.route('/win/count', getWinCount);

export default app;
