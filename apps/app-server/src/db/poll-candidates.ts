import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';
import { PollAnswerSchema } from './poll-answers';

const zUser = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

export const PollCandidateSchema = z.object({
  poll_answer_id: PollAnswerSchema.shape.id,
  poll: PollAnswerSchema.shape.poll,
  curr: zUser.array().length(4),
  prev: zUser.array().min(4),
});

export interface KyPollCandidateTable {
  poll_answer_id: z.infer<typeof PollCandidateSchema>['poll_answer_id'];
  poll: ColumnType<z.infer<typeof PollCandidateSchema>['poll'], string, string>;
  curr: ColumnType<z.infer<typeof PollCandidateSchema>['curr'], string, string>;
  prev: ColumnType<z.infer<typeof PollCandidateSchema>['prev'], string, string>;
}

export type PollCandidate = Selectable<KyPollCandidateTable>;
export type NewPollCandidate = Insertable<KyPollCandidateTable>;
export type PollCandidateUpdate = Updateable<KyPollCandidateTable>;
