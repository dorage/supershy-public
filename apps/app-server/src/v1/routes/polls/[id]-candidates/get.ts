import { PollAnswerSchema } from '@/src/db/poll-answers';
import { PollCandidateSchema } from '@/src/db/poll-candidates';
import { SchoolStudentSchema } from '@/src/db/school-students';
import { UserSchema } from '@/src/db/users';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

/**
 * @deprecated since version 1.0.1
 */
const app = new Hono<SuperShyEnv>();

const zRes = z.object({ refresh: z.number().max(2), candidates: PollCandidateSchema.shape.curr });

app.get('/:id/candidates', async (c) => {
  const user = c.get('auth_userSchema');
  const { id } = c.req.param();
  const pollAnswerId = Number(id);

  if (Number.isNaN(pollAnswerId)) {
    throw new HTTPException(404);
  }

  const candidates = await Ky.selectFrom('poll_candidates')
    .selectAll()
    .where('poll_answer_id', '=', pollAnswerId)
    .executeTakeFirst();

  // candidates가 이미 있다면 반환
  if (candidates) {
    return c.json(
      zRes.parse({
        refresh: 3 - candidates.prev.length / 4,
        candidates: candidates.curr,
      })
    );
  }

  const newCandidates = await createNewCandidates(pollAnswerId, user);

  return c.json(
    zRes.parse({
      refresh: 3 - newCandidates.prev.length / 4,
      candidates: newCandidates.curr,
    })
  );
});

const random = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const randomIndexes = (max: number): number[] => {
  const set = new Set();
  while (set.size < Math.min(4, max)) {
    set.add(random(max));
  }
  return [...set] as number[];
};

const createNewCandidates = async (pollAnswerId: number, user: z.infer<typeof UserSchema>) => {
  const pollAnswer = PollAnswerSchema.parse(
    await Ky.selectFrom('poll_answers')
      .selectAll()
      .where('id', '=', pollAnswerId)
      .where('winner_id', 'is', null)
      .executeTakeFirstOrThrow()
  );

  const schoolStudents = SchoolStudentSchema.parse(
    await Ky.selectFrom('school_students')
      .selectAll()
      .where('nspn', '=', user.nspn)
      .where('grade', '=', user.grade)
      .executeTakeFirstOrThrow()
  );

  let candidates: z.infer<typeof PollCandidateSchema.shape.curr> = [];

  if (pollAnswer.poll.gender === 'm') {
    // find only male
    const males = schoolStudents.students.filter((e) => e.gender === 'm' && e.id !== user.id);
    candidates = randomIndexes(males.length).map((idx) => males[idx]);
  } else if (pollAnswer.poll.gender === 'f') {
    // find only female
    const females = schoolStudents.students.filter((e) => e.gender === 'f' && e.id !== user.id);
    candidates = randomIndexes(females.length).map((idx) => females[idx]);
  } else if (pollAnswer.poll.gender === 'o') {
    // find opposite gender user
    const students = schoolStudents.students.filter(
      (e) => e.gender !== user.gender && e.id !== user.id
    );
    candidates = randomIndexes(students.length).map((idx) => students[idx]);
  } else if (pollAnswer.poll.gender === 'u') {
    // find every user
    const students = schoolStudents.students.filter((e) => e.id !== user.id);
    candidates = randomIndexes(students.length).map((idx) => students[idx]);
  }

  if (pollAnswer.poll.include) {
    candidates[1] = pollAnswer.poll.include;
  }

  while (candidates.length < 4) {
    candidates.push({
      id: -1,
      name: '',
      gender: user.gender === 'm' ? 'f' : 'm',
    });
  }

  await Ky.insertInto('poll_candidates')
    .values({
      poll_answer_id: pollAnswerId,
      poll: JSON.stringify(PollCandidateSchema.shape.poll.parse(pollAnswer.poll)),
      curr: JSON.stringify(PollCandidateSchema.shape.curr.parse(candidates)),
      prev: JSON.stringify(PollCandidateSchema.shape.prev.parse(candidates)),
    })
    .execute();

  return Ky.selectFrom('poll_candidates')
    .selectAll()
    .where('poll_answer_id', '=', pollAnswerId)
    .executeTakeFirstOrThrow();
};

export default app;
