import { SchoolStudentSchema } from '@/src/db/school-students';
import { UserSchema } from '@/src/db/users';
import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import OneSignalHelper from '@/src/helpers/onesignal';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  grade: UserSchema.shape.grade,
});

app.put(
  '/grade',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender', 'nspn'], null: ['grade'] }),
  zValidator('json', zJson),
  async (c) => {
    const user = c.get('auth_userSchema');
    const json = c.req.valid('json');

    // get a row of school_students
    const schoolStudents = await Ky.selectFrom('school_students')
      .selectAll()
      .where('nspn', '=', user.nspn)
      .where('grade', '=', json.grade)
      .executeTakeFirst();

    if (schoolStudents == null) {
      throw new HTTPException(500);
    }

    if (schoolStudents.students.length == 19) {
      for (const student of schoolStudents.students) {
        OneSignalHelper.sendNotificationToUser({
          heading: 'Sekolahmu buka baru!',
          content: 'Ada 20 orang di sekolahmu',
          userId: student.id,
        });
      }
    }

    await Ky.updateTable('school_students')
      .set(() => ({
        students: sql<string>`JSON_ARRAY_APPEND(students, '$', ${JSON.stringify(
          SchoolStudentSchema.shape.students.element.parse(user)
        )})`,
        is_opened: schoolStudents.students.length >= 19 ? true : false,
      }))
      .where('nspn', '=', user.nspn)
      .where('grade', '=', json.grade)
      .execute();
    // update user grade
    await Ky.updateTable('users').set({ grade: json.grade }).where('id', '=', user.id).execute();

    return c.json({ okay: true });
  }
);

export default app;
