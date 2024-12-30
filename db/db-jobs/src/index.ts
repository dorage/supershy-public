import { sql } from 'kysely';
import { createKysely } from './kysely';
import { faker } from '@faker-js/faker';
import { SchoolStudentSchema } from 'app-schema';

const main = async () => {
  const kysely = createKysely('development');

  const get1 = await sql<{ id: Buffer }>`SELECT * FROM bin_test`.execute(kysely);
  console.log(get1.rows[0]);
  const get2 = await sql<{
    id: Buffer;
  }>`SELECT * FROM bin_test WHERE id = ${get1.rows[0].id.toString()}`.execute(kysely);
  console.log('🚀 ~ file: index.ts:11 ~ main ~ res:', get2.rows);

  return;

  const res =
    await sql`CREATE OR REPLACE VIEW poll_today AS SELECT * FROM polls ORDER BY RAND() LIMIT 10`.execute(
      kysely
    );

  const nspn = '10504631';
  const grade = '1';

  for (let i = 0; i < 9; i++) {
    await kysely.transaction().execute(async (trx) => {
      const insertRes = await trx
        .insertInto('users')
        .values({
          name: faker.person.lastName().slice(20),
          gender: 'm',
          school: JSON.stringify({ nspn: nspn }),
          grade: grade,
          auth: JSON.stringify({}),
        })
        .execute();

      const user = await trx
        .selectFrom('users')
        .selectAll()
        .where('id', '=', Number(insertRes[0].insertId))
        .executeTakeFirst();
      await trx
        .updateTable('school_students')
        .set({
          students: sql<string>`JSON_ARRAY_APPEND(students, '$', ${JSON.stringify(
            SchoolStudentSchema.shape.students.element.parse(user)
          )})`,
        })
        .where('nspn', '=', nspn)
        .where('grade', '=', grade)
        .execute();
    });
  }
  for (let i = 0; i < 9; i++) {
    await kysely.transaction().execute(async (trx) => {
      const insertRes = await trx
        .insertInto('users')
        .values({
          name: faker.person.lastName().slice(20),
          gender: 'f',
          school: JSON.stringify({ nspn: nspn }),
          grade: grade,
          auth: JSON.stringify({}),
        })
        .execute();
      const user = await trx
        .selectFrom('users')
        .selectAll()
        .where('id', '=', Number(insertRes[0].insertId))
        .executeTakeFirst();
      await trx
        .updateTable('school_students')
        .set({
          students: sql<string>`JSON_ARRAY_APPEND(students, '$', ${JSON.stringify(
            SchoolStudentSchema.shape.students.element.parse(user)
          )})`,
        })
        .where('nspn', '=', nspn)
        .where('grade', '=', grade)
        .execute();
    });
  }

  await kysely.destroy();
};

main();
