import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import moment from 'moment';
import { z } from 'zod';

export const UserIAPsSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  transaction_id: z.string(),
  product_id: z.string(),
  created_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
});

export interface KyUserIAPsTable {
  id: Generated<z.infer<typeof UserIAPsSchema.shape.id>>;
  user_id: z.infer<typeof UserIAPsSchema.shape.user_id>;
  transaction_id: z.infer<typeof UserIAPsSchema.shape.transaction_id>;
  product_id: z.infer<typeof UserIAPsSchema.shape.product_id>;
  created_at: Generated<z.infer<typeof UserIAPsSchema.shape.created_at>>;
}

export type UserIAPs = Selectable<KyUserIAPsTable>;
export type NewUserIAPs = Insertable<KyUserIAPsTable>;
export type UserIAPsUpdate = Updateable<KyUserIAPsTable>;
