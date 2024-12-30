import { KyAppHealthTable } from './app-health';
import { KyAppVersionTable } from './app-versions';
import { KyCityTable } from './cities';
import { KyCitySchoolTable } from './city-schools';
import { KyJWTTable } from './jwts';
import { KyPollAnswerTable } from './poll-answers';
import { KyPollCandidateTable } from './poll-candidates';
import { KyPollPremiumTable } from './poll-premiums';
import { KyPollTodayView } from './poll-today';
import { KyPollTable } from './polls';
import { KySchoolStudentTable } from './school-students';
import { KySchoolTable } from './schools';
import { KyUserIAPsTable } from './user-iaps';
import { KyUserTable } from './users';

export interface DB {
  versions: KyAppVersionTable;
  app_health: KyAppHealthTable;

  cities: KyCityTable;
  city_schools: KyCitySchoolTable;
  schools: KySchoolTable;
  school_students: KySchoolStudentTable;
  users: KyUserTable;
  user_iaps: KyUserIAPsTable;
  jwts: KyJWTTable;
  poll_answers: KyPollAnswerTable;
  poll_candidates: KyPollCandidateTable;
  poll_premiums: KyPollPremiumTable;
  polls: KyPollTable;

  // views
  poll_today: KyPollTodayView;
}
