import { Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';

export const PollTodaySchema = z.object({
  id: z.number(),
  question: z.string(),
  gender: zColumns.poll_gender,
});

export interface KyPollTodayView {
  id: z.infer<typeof PollTodaySchema>['id'];
  question: z.infer<typeof PollTodaySchema>['question'];
  gender: z.infer<typeof PollTodaySchema>['gender'];
}

export type PollToday = Selectable<KyPollTodayView>;
export type NewPollToday = Insertable<KyPollTodayView>;
export type PollTodayUpdate = Updateable<KyPollTodayView>;
