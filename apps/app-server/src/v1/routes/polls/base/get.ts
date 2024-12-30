import { PollAnswerSchema } from '@/src/db/poll-answers';
import { PollPremiumSchema } from '@/src/db/poll-premiums';
import { PollTodayViewSchema } from '@/src/db/poll-today';
import { UserSchema } from '@/src/db/users';
import { dateHelpers } from '@/src/helpers/date';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { HTTPException } from 'hono/http-exception';

const app = new Hono<SuperShyEnv>();

const cJson = z
  .object({
    id: PollAnswerSchema.shape.id,
    poll: PollAnswerSchema.shape.poll,
  })
  .array();

app.get('/', async (c) => {
  const user = c.get('auth_userSchema');

  const schoolStudent = await Ky.selectFrom('school_students')
    .selectAll()
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .executeTakeFirstOrThrow();

  if (!schoolStudent.is_opened) {
    throw new HTTPException(403, { message: 'school is not opend yet' });
  }

  if (!(await isTodayPollCreated(user))) {
    // insert today poll
    await insertPollPremiumToAnswer(user);
    await insertPollTodayToAnswer(user);
  }

  // get today poll
  const pollAnswers = await selectTodayPollAnswers(user);

  return c.json(cJson.parse(pollAnswers));
});

const isTodayPollCreated = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('voter_id', '=', user.id)
    .where('poll_date', '=', dateHelpers.getPollDate())
    .executeTakeFirst();
  return result != null;
};

const selectTodayPollAnswers = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('voter_id', '=', user.id)
    .where('poll_date', '=', dateHelpers.getPollDate())
    .where('winner_id', 'is', null)
    .execute();
  return PollAnswerSchema.array().parse(result);
};

const insertPollPremiumToAnswer = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_premiums')
    .selectAll()
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .where('poll_date', '=', dateHelpers.getPollDate())
    .executeTakeFirst();

  if (result == null) return;

  const poll_premiums = PollPremiumSchema.parse(result);

  for (const poll of poll_premiums.polls) {
    // 같은 gender 는 패스
    if (poll.gender === user.gender) continue;
    // 내가 포함된 poll이라면 패스
    if (poll.include?.id === user.id) continue;

    await Ky.insertInto('poll_answers')
      .values({
        poll: JSON.stringify(PollAnswerSchema.shape.poll.parse(poll)),
        voter: JSON.stringify(PollAnswerSchema.shape.voter.parse(user)),
        winner: null,
        poll_date: dateHelpers.getPollDate(),
      })
      .execute();
  }
};

const insertPollTodayToAnswer = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_today').selectAll().execute();
  const today_polls = PollTodayViewSchema.array().parse(result);

  for (const poll of today_polls) {
    // 같은 gender 는 패스
    if (poll.gender === user.gender) continue;

    await Ky.insertInto('poll_answers')
      .values({
        poll: JSON.stringify(PollAnswerSchema.shape.poll.parse(poll)),
        voter: JSON.stringify(PollAnswerSchema.shape.voter.parse(user)),
        winner: null,
        poll_date: dateHelpers.getPollDate(),
      })
      .execute();
  }
};

export default app;
