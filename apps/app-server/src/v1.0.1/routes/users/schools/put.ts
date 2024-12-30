import { Ky } from '@/src/helpers/kysely';
import { SuperShyEnv } from '@/src/globals';
import { useAuth } from '@/src/middlewares/auth';
import { useUser, useUserRegistered } from '@/src/v1/middlewares/user';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { z } from 'zod';
import { CitySchoolSchema, SchoolSchema } from 'app-schema';

const app = new Hono<SuperShyEnv>();

export const zJson = z.object({
  city: SchoolSchema.shape.city,
  nspn: SchoolSchema.shape.nspn,
  type: SchoolSchema.shape.type,
});

app.use(
  '*',
  useAuth(),
  useUser(),
  useUserRegistered({ fill: ['name', 'gender'], null: ['school', 'grade'] })
);

app.put(zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const json = c.req.valid('json');
  const schoolGroupId = `20232${json.nspn}`;

  await selectOrCreateSchoolGroup(schoolGroupId, json);

  // user 업데이트
  await Ky.updateTable('users')
    .set({ school_group_id: schoolGroupId })
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

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

const selectOrCreateSchoolGroup = async (schoolGroupId: string, props: z.infer<typeof zJson>) => {
  const schoolInfo = await getSchoolInfo(props);

  let school = await Ky.selectFrom('school_groups')
    .selectAll()
    .where('id', '=', schoolGroupId)
    .executeTakeFirst();

  if (school == null) {
    await Ky.insertInto('school_groups')
      .values({
        id: schoolGroupId,
        type: props.type,
        name: schoolInfo.name,
        city: schoolInfo.city,
      })
      .execute();
  }

  return school;
};

export default app;
