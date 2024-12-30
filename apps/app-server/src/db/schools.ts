import { z } from 'zod';
import { zColumns } from './globals';
import { _z } from '../helpers/zod';
import { Insertable, Selectable, Updateable } from 'kysely';

export const SchoolSchema = z.object({
  nspn: zColumns.school_nspn,
  type: zColumns.school_type,
  name: z.string(),
  city: zColumns.city_id,
});

export interface KySchoolTable {
  nspn: z.infer<typeof SchoolSchema.shape.nspn>;
  type: z.infer<typeof SchoolSchema.shape.type>;
  name: z.infer<typeof SchoolSchema.shape.name>;
  city: z.infer<typeof SchoolSchema.shape.city>;
}

export type School = Selectable<KySchoolTable>;
export type NewSchool = Insertable<KySchoolTable>;
export type SchoolUpdate = Updateable<KySchoolTable>;
