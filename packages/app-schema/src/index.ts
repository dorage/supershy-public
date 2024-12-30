import type { KyAppHealthTable } from './schemas/app-health';
import { AppHealthSchema as _AppHealthSchema } from './schemas/app-health';
import type { KyAppVersionTable } from './schemas/app-versions';
import { AppVersionSchema as _AppVersionSchema } from './schemas/app-versions';
import type { KyCityTable } from './schemas/cities';
import { CitySchema as _CitySchema } from './schemas/cities';
import type { KyCitySchoolTable } from './schemas/city-schools';
import { CitySchoolSchema as _CitySchoolSchema } from './schemas/city-schools';
import type { KyJWTTable } from './schemas/jwts';
import { JWTSchema as _JWTSchema } from './schemas/jwts';
import type { KyPollAnswerTable } from './schemas/poll-answers';
import { PollAnswerSchema as _PollAnswerSchema } from './schemas/poll-answers';
import type { KyPollCandidateTable } from './schemas/poll-candidates';
import { PollCandidateSchema as _PollCandidateSchema } from './schemas/poll-candidates';
import type { KyPollPremiumTable } from './schemas/poll-premiums';
import { PollPremiumSchema as _PollPremiumSchema } from './schemas/poll-premiums';
import type { KyPollTodayView } from './schemas/poll-today';
import { PollTodaySchema as _PollTodaySchema } from './schemas/poll-today';
import type { KyPollTable } from './schemas/polls';
import { PollSchema as _PollSchema } from './schemas/polls';
import type { KySchoolGroupTable } from './schemas/school-groups';
import { SchoolGroupSchema as _SchoolGroupSchema } from './schemas/school-groups';
import type { KySchoolStudentTable } from './schemas/school-students';
import { SchoolStudentSchema as _SchoolStudentSchema } from './schemas/school-students';
import type { KySchoolTable } from './schemas/schools';
import { SchoolSchema as _SchoolSchema } from './schemas/schools';
import type { KyShortenUrlTable } from './schemas/shorten-urls';
import { ShortenUrlSchema as _ShortenUrlSchema } from './schemas/shorten-urls';
import type { KyUserIAPsTable } from './schemas/user-iaps';
import { UserIAPsSchema as _UserIAPsSchema } from './schemas/user-iaps';
import type { KyUserOTPsTable } from './schemas/user-otps';
import { UserOTPsSchema as _UserOTPsSchema } from './schemas/user-otps';
import type { KyUserTable } from './schemas/users';
import { UserSchema as _UserSchema } from './schemas/users';

import { Kysely, MysqlDialect, ParseJSONResultsPlugin } from 'kysely';
import { PoolOptions, createPool } from 'mysql2'; // do not use 'mysql2/promises'!

export interface DB {
  versions: KyAppVersionTable;
  app_health: KyAppHealthTable;

  cities: KyCityTable;
  city_schools: KyCitySchoolTable;
  schools: KySchoolTable;
  school_groups: KySchoolGroupTable;
  school_students: KySchoolStudentTable;
  users: KyUserTable;
  user_otps: KyUserOTPsTable;
  user_iaps: KyUserIAPsTable;

  jwts: KyJWTTable;
  poll_answers: KyPollAnswerTable;
  poll_candidates: KyPollCandidateTable;
  poll_premiums: KyPollPremiumTable;
  polls: KyPollTable;
  shorten_urls: KyShortenUrlTable;

  // views
  poll_today: KyPollTodayView;
}

export const AppHealthSchema = _AppHealthSchema;
export const AppVersionSchema = _AppVersionSchema;
export const CitySchema = _CitySchema;
export const CitySchoolSchema = _CitySchoolSchema;
export const JWTSchema = _JWTSchema;
export const PollAnswerSchema = _PollAnswerSchema;
export const PollCandidateSchema = _PollCandidateSchema;
export const PollPremiumSchema = _PollPremiumSchema;
export const PollTodaySchema = _PollTodaySchema;
export const PollSchema = _PollSchema;
export const SchoolStudentSchema = _SchoolStudentSchema;
export const SchoolGroupSchema = _SchoolGroupSchema;
export const SchoolSchema = _SchoolSchema;
export const UserIAPsSchema = _UserIAPsSchema;
export const UserSchema = _UserSchema;
export const UserOTPsSchema = _UserOTPsSchema;
export const ShortenUrlSchema = _ShortenUrlSchema;

export const initialize = (options: PoolOptions) => {
  const dialect = new MysqlDialect({
    pool: async () => createPool(options),
  });

  // Database interface is passed to Kysely's constructor, and from now on, Kysely
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
  // to communicate with your database.
  return new Kysely<DB>({
    dialect,
    plugins: [new ParseJSONResultsPlugin()],
  });
};
