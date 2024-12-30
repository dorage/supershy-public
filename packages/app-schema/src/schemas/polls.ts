import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';

export const PollSchema = z.object({
  id: z.number(),
  question: z.string(),
  gender: zColumns.poll_gender,
});

export interface KyPollTable {
  id: Generated<z.infer<typeof PollSchema>['id']>;
  question: z.infer<typeof PollSchema>['question'];
  gender: z.infer<typeof PollSchema>['gender'];
}

export type Poll = Selectable<KyPollTable>;
export type NewPoll = Insertable<KyPollTable>;
export type PollUpdate = Updateable<KyPollTable>;
