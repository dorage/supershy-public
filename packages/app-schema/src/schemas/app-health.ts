import type { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';

export const AppHealthSchema = z.object({
  is_enabled: z.coerce.boolean(),
});

export interface KyAppHealthTable {
  is_enabled: z.infer<typeof AppHealthSchema.shape.is_enabled>;
}

export type AppHealth = Selectable<KyAppHealthTable>;
export type NewAppHealth = Insertable<KyAppHealthTable>;
export type AppHealthUpdate = Updateable<KyAppHealthTable>;
