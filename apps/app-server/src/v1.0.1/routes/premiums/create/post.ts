import { dateHelpers } from '@/src/helpers/date';
import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { PollPremiumSchema, PollSchema } from 'app-schema';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  question: PollSchema.shape.question,
  include: z.boolean({}),
});

app.post('/create', zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const json = c.req.valid('json');
  const pollDate = dateHelpers.getPollDate(1);

  const pollPremiums = await Ky.selectFrom('poll_premiums')
    .selectAll()
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .where('poll_date', '=', pollDate)
    .executeTakeFirst();

  if (pollPremiums == null)
    await Ky.insertInto('poll_premiums')
      .values({
        polls: '[]',
        grade: user.grade!,
        nspn: user.nspn!,
        poll_date: pollDate,
      })
      .execute();

  // poll-premium 추가
  await Ky.updateTable('poll_premiums')
    .set({
      polls: sql`JSON_ARRAY_APPEND(polls, '$', ${JSON.stringify(
        PollPremiumSchema.shape.polls.element.parse({
          question: json.question,
          gender: 'u',
          include: json.include ? user : null,
        })
      )})`,
    })
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .where('poll_date', '=', pollDate)
    .execute();

  await Ky.updateTable('users')
    .set({ vip: sql`JSON_REPLACE(vip, '$.create', FALSE)` })
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

export default app;
