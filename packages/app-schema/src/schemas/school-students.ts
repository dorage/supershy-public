import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';
import { PollAnswerSchema } from './poll-answers';
import moment from 'moment';

const zSchoolStudent = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name,
  gender: zColumns.user_gender,
});

const zRecentAnswer = z.object({
  id: PollAnswerSchema.shape.id,
  winner: PollAnswerSchema.shape.winner,
  updated_at: z.coerce.date().transform((arg) => moment(arg).utc(false)),
});

export const SchoolStudentSchema = z.object({
  id: z.number(),
  nspn: zColumns.school_nspn,
  grade: zColumns.school_grade,
  is_opened: z.coerce.boolean(),
  students: zSchoolStudent.array(),
  recent_answers: zRecentAnswer.array(),
});

export interface KySchoolStudentTable {
  id: Generated<z.infer<typeof SchoolStudentSchema>['id']>;
  nspn: z.infer<typeof SchoolStudentSchema>['nspn'];
  grade: z.infer<typeof SchoolStudentSchema>['grade'];
  is_opened: Generated<z.infer<typeof SchoolStudentSchema>['is_opened']>;
  students: ColumnType<z.infer<typeof SchoolStudentSchema>['students'], string, string>;
  recent_answers: ColumnType<z.infer<typeof SchoolStudentSchema>['recent_answers'], string, string>;
}

export type SchoolStudent = Selectable<KySchoolStudentTable>;
export type NewSchoolStudent = Insertable<KySchoolStudentTable>;
export type SchoolStudentUpdate = Updateable<KySchoolStudentTable>;
