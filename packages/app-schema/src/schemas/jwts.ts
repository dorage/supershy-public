import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';
import moment from 'moment';
import { z } from 'zod';

export const JWTSchema = z.object({
  id: z.string(),
  expired_at: z.coerce
    .date()
    .or(z.string())
    .transform((arg) => moment(arg).utc(false)),
});

export interface KyJWTTable {
  id: z.infer<typeof JWTSchema>['id'];
  expired_at: ColumnType<string, string | Date, string>;
}

export type JWT = Selectable<KyJWTTable>;
export type NewJWT = Insertable<KyJWTTable>;
export type JWTUpdate = Updateable<KyJWTTable>;
