import { Generated, Insertable, Selectable, Updateable } from 'kysely';
import moment from 'moment';
import { z } from 'zod';

export const UserOTPsSchema = z.object({
  user_id: z.number(),
  phone: z
    .string()
    .length(12)
    .regex(/[0-9]*/),
  otp: z.string(),
  created_at: z.coerce.string().transform((arg) => moment(arg).utc(false)),
});

export interface KyUserOTPsTable {
  user_id: z.infer<typeof UserOTPsSchema.shape.user_id>;
  phone: z.infer<typeof UserOTPsSchema.shape.phone>;
  otp: z.infer<typeof UserOTPsSchema.shape.otp>;
  created_at: Generated<z.infer<typeof UserOTPsSchema.shape.created_at>>;
}

export type UserOTPs = Selectable<KyUserOTPsTable>;
export type NewUserOTPs = Insertable<KyUserOTPsTable>;
export type UserOTPsUpdate = Updateable<KyUserOTPsTable>;
