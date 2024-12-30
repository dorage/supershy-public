import { dateHelpers } from '@/src/helpers/date';
import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { sql } from 'kysely';
import { SuperShyEnv } from '@/src/globals';
import { z } from 'zod';
import { PollPremiumSchema, PollSchema } from 'app-schema';
const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  poll_id: PollSchema.shape.id,
});

app.post('/join', zValidator('json', zJson), async (c) => {
  const user = c.get('auth_userSchema');
  const json = c.req.valid('json');

  if (!user.vip?.join) {
    throw new HTTPException(403);
  }

  const poll = await Ky.selectFrom('polls')
    .selectAll()
    .where('id', '=', json.poll_id)
    .executeTakeFirstOrThrow();
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
        PollPremiumSchema.shape.polls.element.parse({ ...poll, include: user })
      )})`,
    })
    .where('nspn', '=', user.nspn)
    .where('grade', '=', user.grade)
    .where('poll_date', '=', pollDate)
    .execute();

  // 사용권 차감
  await Ky.updateTable('users')
    .set((eb) => ({
      vip: sql`JSON_REPLACE(vip, '$.join', FALSE)`,
    }))
    .where('id', '=', user.id)
    .execute();

  return c.json({ okay: true });
});

export default app;
