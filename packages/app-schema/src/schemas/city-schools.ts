import { z } from 'zod';
import { zColumns } from './globals';
import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import { _z } from '../helpers/zod';

const zCitySchoolInfo = z.object({
  nspn: zColumns.school_nspn,
  name: z.string(),
  city: zColumns.city_id,
});

export const CitySchoolSchema = z.object({
  id: zColumns.city_id,
  name: z.string(),
  smp: _z.json(zCitySchoolInfo.array()),
  smk: _z.json(zCitySchoolInfo.array()),
  sma: _z.json(zCitySchoolInfo.array()),
});

export interface KyCitySchoolTable {
  id: z.infer<typeof CitySchoolSchema>['id'];
  name: z.infer<typeof CitySchoolSchema>['name'];
  smp: ColumnType<z.infer<typeof CitySchoolSchema>['smp'], string, string>;
  smk: ColumnType<z.infer<typeof CitySchoolSchema>['smk'], string, string>;
  sma: ColumnType<z.infer<typeof CitySchoolSchema>['sma'], string, string>;
}

export type CitySchool = Selectable<KyCitySchoolTable>;
export type NewCitySchool = Insertable<KyCitySchoolTable>;
export type CitySchoolUpdate = Updateable<KyCitySchoolTable>;
