import { SuperShyEnv } from '@/src/globals';
import { dateHelpers } from '@/src/helpers/date';
import { useAuth } from '@/src/middlewares/auth';
import { Ky } from '@/src/helpers/kysely';
import { useUser } from '@/src/v1.0.1/middlewares/user';
import { PollAnswerSchema, PollPremiumSchema, PollTodaySchema, UserSchema } from 'app-schema';
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z
  .object({
    id: PollAnswerSchema.shape.id,
    poll: PollAnswerSchema.shape.poll,
  })
  .array();

app.get(useAuth(), useUser(), async (c) => {
  const user = c.get('auth_userSchema');

  if (!(await isTodayPollCreated(user))) {
    // insert today poll
    await insertPollPremiumToAnswer(user);
    await insertPollTodayToAnswer(user);
  }

  // get today poll
  const pollAnswers = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('voter_id', '=', user.id)
    .where('poll_date', '=', dateHelpers.getPollDate())
    .where('winner', 'is', null)
    .execute();

  return c.json(zRes.parse(pollAnswers));
});

const isTodayPollCreated = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('voter_id', '=', user.id)
    .where('poll_date', '=', dateHelpers.getPollDate())
    .executeTakeFirst();

  return result != null;
};

const insertPollPremiumToAnswer = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_premiums')
    .selectAll()
    .where('school_group_id', '=', user.school_group_id)
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
        poll_date: dateHelpers.getPollDate(),
        winner: null,
        school_group_id: null,
      })
      .execute();
  }
};

const insertPollTodayToAnswer = async (user: z.infer<typeof UserSchema>) => {
  const result = await Ky.selectFrom('poll_today').selectAll().execute();
  const today_polls = PollTodaySchema.array().parse(result);

  for (const poll of today_polls) {
    await Ky.insertInto('poll_answers')
      .values({
        poll: JSON.stringify(PollAnswerSchema.shape.poll.parse(poll)),
        voter: JSON.stringify(PollAnswerSchema.shape.voter.parse(user)),
        poll_date: dateHelpers.getPollDate(),
        school_group_id: user.school_group_id,
        winner: null,
      })
      .execute();
  }
};

export default app;
