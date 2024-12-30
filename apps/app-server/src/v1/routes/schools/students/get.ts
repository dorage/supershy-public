import { SchoolStudentSchema } from '@/src/db/school-students';
import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zRes = z.object({
  students: SchoolStudentSchema.shape.students,
});

app.get('/students', async (c) => {
  const user = c.get('auth_userSchema');

  const schoolStudent = await Ky.selectFrom('school_students')
    .selectAll()
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .executeTakeFirstOrThrow();

  return c.json(zRes.parse(schoolStudent));
});

export default app;
