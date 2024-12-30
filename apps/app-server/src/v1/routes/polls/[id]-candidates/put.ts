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

app.put('/:id/candidates', async (c) => {
  const user = c.get('auth_userSchema');
  console.log('🚀 ~ file: put.ts:14 ~ app.put ~ user:', user);
  const { id } = c.req.param();
  console.log('🚀 ~ file: put.ts:16 ~ app.put ~ id:', id);
  const pollAnswerId = Number(id);
  console.log('🚀 ~ file: put.ts:18 ~ app.put ~ pollAnswerId:', pollAnswerId);

  if (Number.isNaN(pollAnswerId)) throw new HTTPException(404);

  const pollCandidate = await Ky.selectFrom('poll_candidates')
    .selectAll()
    .where('poll_answer_id', '=', pollAnswerId)
    .executeTakeFirstOrThrow();

  // refresh 횟수 초과
  if (pollCandidate.prev.length >= 12)
    throw new HTTPException(403, { message: 'exceed limit of refresh' });

  await refreshCandidates(pollCandidate, user);

  return c.json({ okay: true });
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

const refreshCandidates = async (
  pollCandidate: z.infer<typeof PollCandidateSchema>,
  user: z.infer<typeof UserSchema>
) => {
  console.log('🚀 ~ file: put.ts:53 ~ pollCandidate:', pollCandidate);
  const schoolStudents = SchoolStudentSchema.parse(
    await Ky.selectFrom('school_students')
      .selectAll()
      .where('nspn', '=', user.nspn)
      .where('grade', '=', user.grade)
      .executeTakeFirstOrThrow()
  );

  // used candidates's id
  const prevUserIds = new Set(pollCandidate.prev.map((e) => e.id));

  let candidates: z.infer<typeof PollCandidateSchema.shape.curr> = [];

  if (pollCandidate.poll.gender === 'm') {
    // find only male
    const students = schoolStudents.students.filter((e) => e.gender === 'm' && e.id !== user.id);
    const filtered = students.filter((e) => !prevUserIds.has(e.id));

    // 학생이 모자라면 사용했던 학생 다시 사용하기
    if (filtered.length < 4) {
      candidates = randomIndexes(students.length).map((idx) => students[idx]);
    } else {
      candidates = randomIndexes(filtered.length).map((idx) => filtered[idx]);
    }
  } else if (pollCandidate.poll.gender === 'f') {
    // find only female
    const students = schoolStudents.students.filter((e) => e.gender === 'f' && e.id !== user.id);
    const filtered = students.filter((e) => !prevUserIds.has(e.id));

    // 학생이 모자라면 사용했던 학생 다시 사용하기
    if (filtered.length < 4) {
      candidates = randomIndexes(students.length).map((idx) => students[idx]);
    } else {
      candidates = randomIndexes(filtered.length).map((idx) => filtered[idx]);
    }
  } else if (pollCandidate.poll.gender === 'o') {
    // find opposite gender user
    const students = schoolStudents.students.filter(
      (e) => e.gender !== user.gender && e.id !== user.id
    );
    const filtered = students.filter((e) => !prevUserIds.has(e.id));

    // 학생이 모자라면 사용했던 학생 다시 사용하기
    if (filtered.length < 4) {
      candidates = randomIndexes(students.length).map((idx) => students[idx]);
    } else {
      candidates = randomIndexes(filtered.length).map((idx) => filtered[idx]);
    }
  } else if (pollCandidate.poll.gender === 'u') {
    // find every user
    const students = schoolStudents.students.filter((e) => e.id !== user.id);
    const filtered = students.filter((e) => !prevUserIds.has(e.id));

    // 학생이 모자라면 사용했던 학생 다시 사용하기
    if (filtered.length < 4) {
      candidates = randomIndexes(students.length).map((idx) => students[idx]);
    } else {
      candidates = randomIndexes(filtered.length).map((idx) => filtered[idx]);
    }
  }

  console.log('🚀 ~ file: put.ts:114 ~ candidates:', candidates);

  while (candidates.length < 4) {
    candidates.push({
      id: -1,
      name: '',
      gender: user.gender === 'm' ? 'f' : 'm',
    });
  }
  console.log('🚀 ~ file: put.ts:114 ~ candidates:', candidates);

  // update poll_candidates
  return Ky.updateTable('poll_candidates')
    .set({
      curr: JSON.stringify(PollCandidateSchema.shape.curr.parse([...candidates])),
      prev: JSON.stringify(
        PollCandidateSchema.shape.prev.parse([...pollCandidate.prev, ...candidates])
      ),
    })
    .where('poll_answer_id', '=', pollCandidate.poll_answer_id)
    .execute();
};

export default app;
