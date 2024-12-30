import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

import getBase from './base/get';
app.route('', getBase);
import putBase from './base/put';
app.route('', putBase);
import getPollsVote from './polls-vote/get';
app.route('', getPollsVote);
import getPollsVoteCount from './polls-vote-count/get';
app.route('', getPollsVoteCount);
import getPollsWin from './polls-win/get';
app.route('', getPollsWin);
import getPollsWinCount from './polls-win-count/get';
app.route('', getPollsWinCount);
import putSchool from './schools/put';
app.route('', putSchool);
import putGrade from './grade/put';
app.route('', putGrade);

export default app;
