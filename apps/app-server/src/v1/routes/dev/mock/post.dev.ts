import { UserSchema } from '@/src/db/users';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { faker } from '@faker-js/faker';
import { SchoolSchema } from '@/src/db/schools';
import { z } from 'zod';
import { CitySchema } from '@/src/db/cities';
import { SchoolStudentSchema } from '@/src/db/school-students';

const app = new Hono<SuperShyEnv>();

const city = (props: z.infer<typeof CitySchema>) => props;
const mockCities = [
  city({ id: '000000', name: '', children: [] }),
  city({ id: '010000', name: '', children: [] }),
  city({ id: '010100', name: '', children: [] }),
];

const citySchool = () => {};
const mockCitySchool = () => {};

const school = (props: z.infer<typeof SchoolSchema>) => props;
const mockSchools = [
  school({ nspn: 'A-A-ASMP', city: '010101', name: '[smp] A-A-A', type: 'smp' }),
  school({ nspn: 'A-A-ASMK', city: '010101', name: '[smk] A-A-A', type: 'smk' }),
  school({ nspn: 'A-A-ASMA', city: '010101', name: '[sma] A-A-A', type: 'sma' }),
];

app.post('/mock', async (c) => {
  // *
  // * insert city
  // *

  await Ky.insertInto('cities')
    .values({
      id: '000000',
      name: 'root',
      children: JSON.stringify([{ id: '010000', name: 'A' }]),
    })
    .execute();
  await Ky.insertInto('cities')
    .values({
      id: '010000',
      name: 'A',
      children: JSON.stringify([{ id: '010100', name: 'A-A' }]),
    })
    .execute();
  await Ky.insertInto('cities')
    .values({
      id: '010100',
      name: 'A-A',
      children: JSON.stringify([{ id: '010101', name: 'A-A-A' }]),
    })
    .execute();
  console.log('DONE insert cities');

  // * insert city_school

  await Ky.insertInto('city_schools')
    .values({
      id: '010101',
      name: 'A-A-A',
      smp: '[{ "nspn": "A-A-ASMP", "name": "[smp] A-A-A", "city": "010101" }]',
      smk: '[{ "nspn": "A-A-ASMK", "name": "[smk] A-A-A", "city": "010101" }]',
      sma: '[{ "nspn": "A-A-ASMA", "name": "[sma] A-A-A", "city": "010101" }]',
    })
    .execute();

  console.log('DONE insert city_schools');

  // * insert school

  for (const school of mockSchools) {
    await Ky.insertInto('schools').values(school).execute();
  }

  console.log('DONE insert schools');

  // * insert school students

  await Ky.insertInto('school_students')
    .values({
      nspn: 'A-A-ASMP',
      grade: '1',
      students: JSON.stringify([]),
      recent_answers: '[]',
    })
    .execute();
  await Ky.insertInto('school_students')
    .values({
      nspn: 'A-A-ASMP',
      grade: '2',
      students: JSON.stringify([]),
      recent_answers: '[]',
    })
    .execute();
  await Ky.insertInto('school_students')
    .values({
      nspn: 'A-A-ASMP',
      grade: '3',
      students: JSON.stringify([]),
      recent_answers: '[]',
    })
    .execute();

  // * insert tester user
  // first user
  await Ky.insertInto('users')
    .values({
      auth: JSON.stringify(UserSchema.shape.auth.parse({ email: '1@test.com' })),
    })
    .execute();
  // registered name|gender user
  await Ky.insertInto('users')
    .values({
      name: 'name registered',
      gender: 'm',
      auth: JSON.stringify(UserSchema.shape.auth.parse({ email: '2@test.com' })),
    })
    .executeTakeFirst();
  // registered school|grade user
  await Ky.insertInto('users')
    .values({
      name: 'all registered',
      gender: 'm',
      school: sql<string>`${JSON.stringify(mockSchools[0])}`,
      grade: '1',
      auth: JSON.stringify(UserSchema.shape.auth.parse({ email: '3@test.com' })),
    })
    .execute();
  // registered school
  await Ky.insertInto('users')
    .values({
      name: 'all registered',
      gender: 'm',
      school: sql<string>`${JSON.stringify(mockSchools[0])}`,
      auth: JSON.stringify(UserSchema.shape.auth.parse({ email: '4@test.com' })),
    })
    .execute();
  console.log('DONE insert test users');

  // * insert mock users
  for (const school of mockSchools) {
    for (let i = 0; i < 19; i++) {
      const email = faker.internet.email();
      await Ky.insertInto('users')
        .values({
          name: faker.person.firstName(),
          gender: faker.number.int({ min: 0, max: 2 }) === 1 ? 'm' : 'f',
          school: sql<string>`${JSON.stringify(mockSchools[0])}`,
          grade: '1',
          auth: JSON.stringify(UserSchema.shape.auth.parse({ email: email })),
        })
        .execute();
      const user = await Ky.selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirstOrThrow();

      const schoolStudent = await Ky.selectFrom('school_students')
        .selectAll()
        .where('nspn', '=', school.nspn)
        .where('grade', '=', '1')
        .executeTakeFirst();
      if (schoolStudent == null) {
        await Ky.insertInto('school_students')
          .values({ nspn: school.nspn, grade: '1', students: '[]', recent_answers: '[]' })
          .execute();
      }
      await Ky.updateTable('school_students')
        .set({
          students: sql<string>`JSON_ARRAY_APPEND(students, '$', ${JSON.stringify(
            SchoolStudentSchema.shape.students.element.parse(user)
          )})`,
        })
        .where('nspn', '=', school.nspn)
        .where('grade', '=', user.grade)
        .execute();
    }
  }

  console.log('DONE insert mock users');

  // * insert polls
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [f]', gender: 'f' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [f]', gender: 'f' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [f]', gender: 'f' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [f]', gender: 'f' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [m]', gender: 'm' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [m]', gender: 'm' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [m]', gender: 'm' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [m]', gender: 'm' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [u]', gender: 'u' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [u]', gender: 'u' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [u]', gender: 'u' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [u]', gender: 'u' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [o]', gender: 'o' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [o]', gender: 'o' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [o]', gender: 'o' }).execute();
  await Ky.insertInto('polls').values({ question: 'Siapa ganteng [o]', gender: 'o' }).execute();

  // * insert poll_premiums
  // await Ky
  //   .insertInto('poll_premiums')
  //   .values({ polls: JSON.stringify({}), poll_date: '', nspn: '', grade: '1' })
  //   .execute();
  console.log('DONE insert poll_premiums');

  // * create poll_today view
  await sql<string>`CREATE OR REPLACE VIEW poll_today AS SELECT * FROM polls;`.execute(Ky);
  console.log('DONE create poll_today view');

  return c.json({ okay: true });
});

export default app;
