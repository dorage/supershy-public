import { PollAnswerSchema } from '@/src/db/poll-answers';
import { SchoolStudentSchema } from '@/src/db/school-students';
import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';
import moment from 'moment';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import OneSignalHelper from '@/src/helpers/onesignal';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  winner: PollAnswerSchema.shape.winner,
});

app.put('/:id', zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const { id } = c.req.param();
  const { winner } = c.req.valid('json');
  const pollAnswerId = id;

  if (winner == null) {
    throw new HTTPException(500);
  }
  if (Number.isNaN(pollAnswerId)) {
    throw new HTTPException(404);
  }

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', pollAnswerId)
    .where('voter_id', '=', user.id)
    .where('winner', 'is', null)
    .executeTakeFirst();

  const schoolStudents = await Ky.selectFrom('school_students')
    .selectAll()
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .executeTakeFirstOrThrow();

  if (pollAnswer == null) {
    throw new HTTPException(403, { message: 'voted poll' });
  }

  await Ky.updateTable('poll_answers')
    .set({ winner: JSON.stringify(PollAnswerSchema.shape.winner.parse(winner)) })
    .where('id', '=', pollAnswerId)
    .execute();

  if (schoolStudents.recent_answers.length >= 40) {
    await Ky.updateTable('school_students')
      .set({
        recent_answers: sql<string>`JSON_REMOVE(recent_answers, '$[0]')`,
      })
      .where('nspn', '=', user.nspn)
      .where('grade', '=', user.grade)
      .execute();
  }

  await Ky.updateTable('school_students')
    .set({
      recent_answers: sql<string>`JSON_ARRAY_APPEND(recent_answers, '$', ${JSON.stringify(
        SchoolStudentSchema.shape.recent_answers.element.parse({
          id: pollAnswerId,
          winner: winner,
          updated_at: moment().utc(false),
        })
      )})`,
    })
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .execute();

  await OneSignalHelper.sendNotificationToUser({
    heading: 'Seorang memilih kamu, cek baru',
    content: `${pollAnswer.poll.question}`,
    userId: winner.id,
  });

  return c.json({ okay: true });
});

export default app;
