import OneSignalHelper from '@/src/helpers/onesignal';
import ZenzivaHelper from '@/src/helpers/zenziva';
import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { PollAnswer, zPollAnswerCandidate } from 'app-schema/src/schemas/poll-answers';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzI1234567890', 10);

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  winner: zPollAnswerCandidate,
  candidates: zPollAnswerCandidate.array(),
});

app.put(useAuth(), zValidator('json', zJson), async (c) => {
  const payload = c.get('auth_payload');
  const json = c.req.valid('json');
  const { id } = c.req.param();
  const pollAnswerId = id;

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', pollAnswerId)
    .executeTakeFirstOrThrow();

  await Ky.updateTable('poll_answers')
    .set({
      winner: JSON.stringify(json.winner),
      candidates: JSON.stringify(json.candidates),
    })
    .where('id', '=', pollAnswerId)
    .where('voter_id', '=', payload.userId)
    .where('winner', 'is', null)
    .execute();

  const winner = await Ky.selectFrom('users')
    .selectAll()
    .where('phone', '=', json.winner.phone)
    .executeTakeFirst();

  if (winner) {
    await OneSignalHelper.sendNotificationToUser({
      heading: 'Seseorang memilih Anda!',
      content: `${pollAnswer.poll.question}`,
      userId: winner.id,
    });
  } else {
    await sendSMS({ phone: json.winner.phone, pollAnswer: pollAnswer });
  }

  return c.json({ okay: true });
});

const createShortenUrlId = async () => {
  while (true) {
    const id = nanoid(6);
    const exists = await Ky.selectFrom('shorten_urls')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    if (exists == null) return id;
  }
};

const sendSMS = async (options: { phone: string; pollAnswer: PollAnswer }) => {
  if (options.phone === '0'.repeat(12)) return;

  const schoolGroup = await Ky.selectFrom('school_groups')
    .selectAll()
    .where('id', '=', options.pollAnswer.school_group_id)
    .executeTakeFirst();

  const shortenUrlId = await createShortenUrlId();

  await Ky.insertInto('shorten_urls')
    .values({
      id: shortenUrlId,
      poll_answer_id: options.pollAnswer.id,
    })
    .execute();

  if (process.env.MODE === 'development') return;

  if (schoolGroup == null) {
    ZenzivaHelper.sendSMSTo({
      to: options.phone,
      msg: `Teman Anda memilih Anda dalam "${options.pollAnswer.poll.question}"`,
    });
  } else {
    ZenzivaHelper.sendSMSTo({
      to: options.phone,
      msg: `Teman Anda di ${schoolGroup.name} memilih Anda dalam '${options.pollAnswer.poll.question}'\nCek 👉 https://supershy.playplease.us/${shortenUrlId}`,
    });
  }
};

export default app;
