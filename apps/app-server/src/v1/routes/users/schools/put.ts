import { CitySchoolSchema } from '@/src/db/city-schools';
import { SchoolSchema } from '@/src/db/schools';
import { UserSchema } from '@/src/db/users';
import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

export const zJson = z.object({
  city: SchoolSchema.shape.city,
  nspn: SchoolSchema.shape.nspn,
  type: SchoolSchema.shape.type,
});

app.put(
  '/schools',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender'], null: ['nspn', 'grade'] }),
  zValidator('json', zJson),
  async (c) => {
    try {
      const user = c.get('auth_userSchema');
      const json = c.req.valid('json');

      // 학교 있는지 확인
      const school = await selectOrCreateSchool(json, user);
      // user 업데이트
      await Ky.updateTable('users')
        .set({ school: sql<string>`${JSON.stringify(school)}` })
        .where('id', '=', user.id)
        .execute();

      return c.json({ okay: true });
    } catch (err) {
      console.error(err);

      return c.json({ okay: false });
    }
  }
);

const getSchoolInfo = async (props: z.infer<typeof zJson>) => {
  const citySchool = CitySchoolSchema.parse(
    await Ky.selectFrom('city_schools')
      .selectAll()
      .where('id', '=', props.city)
      .executeTakeFirstOrThrow()
  );
  const idx = citySchool[props.type].findIndex((e) => e.nspn === props.nspn);
  return citySchool[props.type][idx];
};

const selectSchool = async (props: z.infer<typeof zJson>) => {
  const result = await Ky.selectFrom('schools')
    .selectAll()
    .where('nspn', '=', props.nspn)
    .executeTakeFirst();
  if (result == null) return null;
  return SchoolSchema.parse(result);
};

const insertSchool = async (props: z.infer<typeof zJson>, user: z.infer<typeof UserSchema>) => {
  const schoolInfo = await getSchoolInfo(props);
  // insert school
  await Ky.transaction().execute(async (trx) => {
    await trx
      .insertInto('schools')
      .values({
        city: schoolInfo.city,
        nspn: schoolInfo.nspn,
        name: schoolInfo.name,
        type: props.type,
      })
      .executeTakeFirstOrThrow();

    // insert grades
    await trx
      .insertInto('school_students')
      .values({
        nspn: props.nspn,
        grade: '1',
        students: JSON.stringify([]),
        recent_answers: JSON.stringify([]),
      })
      .execute();
    await trx
      .insertInto('school_students')
      .values({
        nspn: props.nspn,
        grade: '2',
        students: JSON.stringify([]),
        recent_answers: JSON.stringify([]),
      })
      .execute();
    await trx
      .insertInto('school_students')
      .values({
        nspn: props.nspn,
        grade: '3',
        students: JSON.stringify([]),
        recent_answers: JSON.stringify([]),
      })
      .execute();
  });

  const school = await Ky.selectFrom('schools')
    .selectAll()
    .where('nspn', '=', schoolInfo.nspn)
    .executeTakeFirst();

  return school;
};

const selectOrCreateSchool = async (
  props: z.infer<typeof zJson>,
  user: z.infer<typeof UserSchema>
) => {
  let school = await selectSchool(props);
  if (school == null) {
    await insertSchool(props, user);
    school = await selectSchool(props);
  }
  return school;
};

export default app;
