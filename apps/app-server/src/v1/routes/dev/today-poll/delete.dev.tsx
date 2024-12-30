import { dateHelpers } from '@/src/helpers/date';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { SuperShyEnv } from '@/src/globals';

const app = new Hono<SuperShyEnv>();

app.delete('/today-poll', async (c) => {
  const pollDate = dateHelpers.getPollDate();
  const tmrPollDate = dateHelpers.getPollDate(1);

  await Ky()
    .deleteFrom('poll_candidates')
    .where((eb) =>
      eb(
        'poll_answer_id',
        'in',
        eb.selectFrom('poll_answers').select('id').where('poll_date', '=', pollDate)
      )
    )
    .execute();
  await Ky().deleteFrom('poll_answers').where('poll_date', '=', pollDate).execute();

  await Ky()
    .updateTable('poll_premiums')
    .set({ poll_date: pollDate })
    .where('poll_date', '=', tmrPollDate)
    .execute();

  await Ky().destroy();
  return c.json({ okay: true });
});

export default app;
