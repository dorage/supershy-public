import type { Generated, Insertable, Selectable, Updateable } from 'kysely';
import { z } from 'zod';

export const AppVersionSchema = z.object({
  os: z.enum(['i', 'a']),
  version: z.string(),
  is_enabled: z.coerce.boolean(),
});

export interface KyAppVersionTable {
  os: Generated<z.infer<typeof AppVersionSchema.shape.os>>;
  version: z.infer<typeof AppVersionSchema.shape.version>;
  is_enabled: z.infer<typeof AppVersionSchema.shape.is_enabled>;
}

export type AppVersion = Selectable<KyAppVersionTable>;
export type NewAppVersion = Insertable<KyAppVersionTable>;
export type AppVersionUpdate = Updateable<KyAppVersionTable>;
