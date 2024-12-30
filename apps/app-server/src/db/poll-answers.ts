import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';
import moment from 'moment';
import { PollPremiumSchema } from './poll-premiums';

const zUser = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

export const PollAnswerSchema = z.object({
  id: z.string(),
  poll: PollPremiumSchema.shape.polls.element,
  voter: zUser,
  voter_id: zColumns.user_id,
  winner: zUser.nullable().default(null),
  winner_id: zColumns.user_id.nullable().default(null),
  poll_date: zColumns.poll_date,
  is_checked: z.coerce.boolean(),
  created_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
  updated_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
});

export interface KyPollAnswerTable {
  id: Generated<z.infer<typeof PollAnswerSchema>['id']>;
  poll: ColumnType<z.infer<typeof PollAnswerSchema>['poll'], string, string>;
  voter: ColumnType<z.infer<typeof PollAnswerSchema>['voter'], string, string>;
  voter_id: Generated<z.infer<typeof PollAnswerSchema>['voter_id']>;
  winner: ColumnType<z.infer<typeof PollAnswerSchema>['winner'], null, string>;
  winner_id: Generated<z.infer<typeof PollAnswerSchema>['winner_id']>;
  poll_date: Generated<z.infer<typeof PollAnswerSchema>['poll_date']>;
  is_checked: Generated<z.infer<typeof PollAnswerSchema>['is_checked']>;
  created_at: Generated<z.infer<typeof PollAnswerSchema>['created_at']>;
  updated_at: Generated<z.infer<typeof PollAnswerSchema>['updated_at']>;
}

export type PollAnswer = Selectable<KyPollAnswerTable>;
export type NewPollAnswer = Insertable<KyPollAnswerTable>;
export type PollAnswerUpdate = Updateable<KyPollAnswerTable>;
