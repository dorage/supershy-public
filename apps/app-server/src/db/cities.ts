import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';
import { zColumns } from './globals';
import { _z } from '../helpers/zod';

export const zCityChild = z.object({
  id: zColumns.city_id,
  name: z.string(),
});

export const CitySchema = z.object({
  id: zColumns.city_id,
  name: z.string(),
  children: _z.json(zCityChild.array()),
});

export interface KyCityTable {
  id: z.infer<typeof CitySchema>['id'];
  name: z.infer<typeof CitySchema>['name'];
  children: ColumnType<z.infer<typeof CitySchema>['children'], string, string>;
}

export type City = Selectable<KyCityTable>;
export type NewCity = Insertable<KyCityTable>;
export type CityUpdate = Updateable<KyCityTable>;
