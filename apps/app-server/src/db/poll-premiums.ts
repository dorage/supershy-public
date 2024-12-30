import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';

const zUser = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

const zPoll = z
  .object({
    question: z.string(),
    gender: zColumns.poll_gender,
    include: zUser.nullable().default(null),
  })
  .array();

export const PollPremiumSchema = z.object({
  id: z.number(),
  polls: zPoll,
  nspn: zColumns.school_nspn,
  grade: zColumns.school_grade,
  poll_date: zColumns.poll_date,
});

export interface KyPollPremiumTable {
  id: Generated<z.infer<typeof PollPremiumSchema>['id']>;
  polls: ColumnType<z.infer<typeof PollPremiumSchema>['polls'], string, string>;
  nspn: z.infer<typeof PollPremiumSchema>['nspn'];
  grade: z.infer<typeof PollPremiumSchema>['grade'];
  poll_date: z.infer<typeof PollPremiumSchema>['poll_date'];
}

export type PollPremium = Selectable<KyPollPremiumTable>;
export type NewPollPremium = Insertable<KyPollPremiumTable>;
export type PollPremiumUpdate = Updateable<KyPollPremiumTable>;
