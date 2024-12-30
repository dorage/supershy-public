import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';
import moment from 'moment';
import { PollPremiumSchema } from './poll-premiums';

const zVoter = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

export const zPollAnswerCandidate = z.object({
  id: zColumns.user_id.optional(),
  name: zColumns.user_name,
  gender: zColumns.user_gender.optional(),
  phone: zColumns.user_phone,
});

export const PollAnswerSchema = z.object({
  id: z.string(),
  poll: PollPremiumSchema.shape.polls.element,
  voter: zVoter,
  voter_id: zColumns.user_id,
  poll_date: zColumns.poll_date,
  is_checked: z.coerce.boolean(),
  created_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
  updated_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
  winner: zPollAnswerCandidate.nullable().default(null),
  winner_id: zColumns.user_id.nullable().default(null),
  // v1.0.1
  school_group_id: z.string().nullable().default(null),
  candidates: zPollAnswerCandidate.array().nullable().default(null),
  winner_phone: zColumns.user_phone.nullable().default(null),
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
  // v1.0.1
  school_group_id: Generated<z.infer<typeof PollAnswerSchema>['school_group_id']>;
  candidates: ColumnType<z.infer<typeof PollAnswerSchema>['candidates'], null, string>;
  winner_phone: Generated<z.infer<typeof PollAnswerSchema>['winner_phone']>;
}

export type PollAnswer = Selectable<KyPollAnswerTable>;
export type NewPollAnswer = Insertable<KyPollAnswerTable>;
export type PollAnswerUpdate = Updateable<KyPollAnswerTable>;
