import { Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';

export const PollTodayViewSchema = z.object({
  id: z.number(),
  question: z.string(),
  gender: zColumns.poll_gender,
});

export interface KyPollTodayView {
  id: z.infer<typeof PollTodayViewSchema>['id'];
  question: z.infer<typeof PollTodayViewSchema>['question'];
  gender: z.infer<typeof PollTodayViewSchema>['gender'];
}

export type PollToday = Selectable<KyPollTodayView>;
export type NewPollToday = Insertable<KyPollTodayView>;
export type PollTodayUpdate = Updateable<KyPollTodayView>;
