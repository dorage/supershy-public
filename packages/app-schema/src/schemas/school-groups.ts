import { z } from 'zod';
import { zColumns } from './globals';
import { _z } from '../helpers/zod';
import { Insertable, Selectable, Updateable } from 'kysely';

export const SchoolGroupSchema = z.object({
  id: z.string().length(13),
  type: zColumns.school_type,
  name: z.string(),
  city: zColumns.city_id,
});

export interface KySchoolGroupTable {
  id: z.infer<typeof SchoolGroupSchema.shape.id>;
  type: z.infer<typeof SchoolGroupSchema.shape.type>;
  name: z.infer<typeof SchoolGroupSchema.shape.name>;
  city: z.infer<typeof SchoolGroupSchema.shape.city>;
}

export type SchoolGroup = Selectable<KySchoolGroupTable>;
export type NewSchoolGroup = Insertable<KySchoolGroupTable>;
export type SchoolGroupUpdate = Updateable<KySchoolGroupTable>;
