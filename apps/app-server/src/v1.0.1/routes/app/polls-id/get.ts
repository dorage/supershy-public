import { Ky } from '@/src/helpers/kysely';
import { zValidator } from '@hono/zod-validator';
import { PollAnswerSchema } from 'app-schema';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zParams = z.object({
  id: z.string(),
});

const zRes = z.object({
  poll: z.object({
    question: z.string(),
  }),
  winner: z.object({
    name: z.string(),
  }),
  candidates: z
    .object({
      name: z.string(),
    })
    .array(),
});

app.get(zValidator('param', zParams), async (c) => {
  const { id } = c.req.valid('param');

  const shortenUrl = await Ky.selectFrom('shorten_urls')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirstOrThrow();

  const pollAnswer = await Ky.selectFrom('poll_answers')
    .selectAll()
    .where('id', '=', shortenUrl.poll_answer_id)
    .executeTakeFirst();

  return c.json(zRes.parse(pollAnswer));
});

export default app;
