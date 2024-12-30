import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { _z } from '../helpers/zod';
import { zColumns } from './globals';
import { SchoolSchema } from './schools';

export const zUserAuth = z.object({
  email: z.string().nullable().default(null),
  apple: z.string().nullable().default(null),
  google_refresh: z.string().nullable().default(null),
  apple_refresh: z.string().nullable().default(null),
  // v1.1.0
  account_id: z.string().nullable().default(null),
  password: z.string().nullable().default(null),
});

const zUserVip = z.object({
  create: z.coerce.boolean().default(false),
  join: z.coerce.boolean().default(false),
});

const zUserSchool = z.object({
  nspn: SchoolSchema.shape.nspn,
  name: SchoolSchema.shape.name,
  type: SchoolSchema.shape.type,
});

export const UserSchema = z.object({
  id: zColumns.user_id,
  name: zColumns.user_name.nullable().default(null),
  gender: zColumns.user_gender.nullable().default(null),
  grade: zColumns.school_grade.nullable().default(null),
  coin: z.number().default(0),
  auth: _z.json(zUserAuth),
  school: zUserSchool.nullable().default(null),
  vip: zUserVip,
  created_at: z.coerce.date(),
  nspn: zColumns.school_nspn.nullable().default(null),
  google_id: z.string().nullable().default(null),
  email: z.string(),
  apple: z.string().nullable().default(null),
  // v1.0.1
  phone: z
    .string()
    .length(12)
    .regex(/[0-9]*/)
    .nullable()
    .default(null),
  school_group_id: z.string().nullable().default(null),
  // v 1.1.0
  account_id: z.string().nullable().default(null),
  password: z.string().nullable().default(null),
});

export interface KyUserTable {
  id: Generated<z.infer<typeof UserSchema.shape.id>>;
  name: z.infer<typeof UserSchema.shape.name>;
  gender: z.infer<typeof UserSchema.shape.gender>;
  grade: z.infer<typeof UserSchema.shape.grade>;
  coin: Generated<z.infer<typeof UserSchema.shape.coin>>;
  auth: ColumnType<z.infer<typeof UserSchema.shape.auth>, string, string>;
  school: ColumnType<z.infer<typeof UserSchema.shape.school>, string | null, string>;
  vip: ColumnType<z.infer<typeof UserSchema.shape.vip>, string | null, string>;
  created_at: Generated<z.infer<typeof UserSchema.shape.created_at>>;
  nspn: Generated<z.infer<typeof UserSchema.shape.nspn>>;
  google_id: Generated<z.infer<typeof UserSchema.shape.google_id>>;
  email: Generated<z.infer<typeof UserSchema.shape.email>>;
  apple: Generated<z.infer<typeof UserSchema.shape.apple>>;
  // v1.0.1
  phone: Generated<z.infer<typeof UserSchema.shape.phone>>;
  school_group_id: Generated<z.infer<typeof UserSchema.shape.school_group_id>>;
  // v1.1.0
  account_id: Generated<z.infer<typeof UserSchema.shape.account_id>>;
  password: Generated<z.infer<typeof UserSchema.shape.password>>;
}

export type User = Selectable<KyUserTable>;
export type NewUser = Insertable<KyUserTable>;
export type UserUpdate = Updateable<KyUserTable>;
