import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import moment from 'moment';
import { z } from 'zod';

export const ShortenUrlSchema = z.object({
  id: z.string(),
  poll_answer_id: z.string(),
  created_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
});

export interface KyShortenUrlTable {
  id: z.infer<typeof ShortenUrlSchema.shape.id>;
  poll_answer_id: z.infer<typeof ShortenUrlSchema.shape.poll_answer_id>;
  created_at: Generated<z.infer<typeof ShortenUrlSchema.shape.created_at>>;
}

export type ShortenUrl = Selectable<KyShortenUrlTable>;
export type NewShortenUrl = Insertable<KyShortenUrlTable>;
export type ShortenUrlUpdate = Updateable<KyShortenUrlTable>;
