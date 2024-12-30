DROP TABLE IF EXISTS app_health;
DROP TABLE IF EXISTS versions;
DROP TABLE IF EXISTS poll_candidates;
DROP TABLE IF EXISTS poll_answers;
DROP TABLE IF EXISTS poll_premiums;
DROP TABLE IF EXISTS polls;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS jwts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS school_students;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS city_schools;
DROP TABLE IF EXISTS cities;


CREATE TABLE IF NOT EXISTS cities (
  id CHAR(6) PRIMARY KEY,
  name TEXT NOT NULL, 
  children JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS city_schools (
  id CHAR(6) PRIMARY KEY,
  name TEXT NOT NULL, 
  smp JSON NOT NULL,
  smk JSON NOT NULL,
  sma JSON NOT NULL
);

CREATE TABLE IF NOT EXISTS schools (
  nspn CHAR(8) PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  city CHAR(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS school_students (
  nspn CHAR(8) PRIMARY KEY,
  grade CHAR(1) NOT NULL,
  students JSON NOT NULL,
  recent_answers JSON NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (nspn) REFERENCES schools(nspn)
);
CREATE INDEX idx_school_students_nspn_grade on school_students (nspn, grade);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name TEXT CHECK (LENGTH(name) <= 30),
  gender CHAR(1),
  CHECK (gender = 'm' OR gender = 'f'),
  grade CHAR(1),
  CHECK (grade = '1' OR grade ='2' OR grade = '3' OR grade = '4' OR grade = '5' OR grade = '6'),
  coin INTEGER DEFAULT 0,
  school JSON,
  auth JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users ADD COLUMN email VARCHAR(255)
  GENERATED ALWAYS AS (JSON_EXTRACT(auth, '$.email'));
CREATE INDEX idx_users_email on users (email);
ALTER TABLE users ADD COLUMN apple VARCHAR(255)
  GENERATED ALWAYS as (JSON_EXTRACT(auth, "$.apple"));
CREATE INDEX idx_users_apple on users (apple);
ALTER TABLE users ADD COLUMN nspn CHAR(8)
  GENERATED ALWAYS as (JSON_EXTRACT(school, "$.nspn"));
CREATE INDEX idx_users_nspn on users (nspn);


CREATE TABLE IF NOT EXISTS jwts (
  id CHAR(36) PRIMARY KEY,
  expired_at DATETIME NOT NULL
);

CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  content JSON NOT NULL,
  user_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS polls (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  question TEXT NOT NULL,
  gender CHAR(1) NOT NULL,
  CHECK (gender = 'm' OR gender = 'f' OR gender = 'u' OR gender = 'o')
);

CREATE TABLE IF NOT EXISTS poll_premiums (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  polls JSON NOT NULL,
  nspn CHAR(8) NOT NULL,
  grade CHAR(1),
  CHECK (grade = '1' OR grade ='2' OR grade = '3' OR grade = '4' OR grade = '5' OR grade = '6'),
  poll_date CHAR(10) NOT NULL,
  FOREIGN KEY (nspn) REFERENCES schools(nspn)
);
CREATE INDEX idx_poll_premiums_poll_date_nspn_grade ON poll_premiums (poll_date, nspn, grade);

CREATE TABLE IF NOT EXISTS poll_answers (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  poll JSON NOT NULL,
  voter JSON NOT NULL,
  winner JSON,
  poll_date CHAR(10) NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE poll_answers ADD COLUMN voter_id INTEGER
  GENERATED ALWAYS as (JSON_EXTRACT(voter, "$.id"));
CREATE INDEX idx_poll_answers_voter_id ON poll_answers (voter_id);
ALTER TABLE poll_answers ADD COLUMN winner_id INTEGER
  GENERATED ALWAYS as (JSON_EXTRACT(winner, "$.id"));
CREATE INDEX idx_poll_answers_winner_id ON poll_answers (winner_id);
CREATE INDEX idx_poll_answers_poll_date ON poll_answers (poll_date);

CREATE TABLE IF NOT EXISTS poll_candidates (
  poll_answer_id INTEGER PRIMARY KEY AUTO_INCREMENT,
  poll JSON NOT NULL,
  curr JSON NOT NULL,
  prev JSON NOT NULL,
  FOREIGN KEY (poll_answer_id) REFERENCES poll_answers(id)
);
CREATE INDEX idx_poll_candidates_voter_id ON poll_candidates (poll_answer_id);

CREATE TABLE IF NOT EXISTS versions (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  os CHAR(1) CHECK (os = 'a' OR os = 'i') NOT NULL,
  version TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT TRUE
);
CREATE INDEX idx_versions_os ON versions (os);

CREATE TABLE IF NOT EXISTS app_health (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  is_enabled BOOLEAN DEFAULT TRUE
);
INSERT INTO app_health(is_enabled) VALUES (1);