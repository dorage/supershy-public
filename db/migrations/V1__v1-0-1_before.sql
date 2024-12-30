-- OTP table

CREATE TABLE IF NOT EXISTS user_otps (
    user_id INTEGER PRIMARY KEY,
    phone VARCHAR(12) NOT NULL,
    otp CHAR(6) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Schools Table 변경

-- CREATE TABLE IF NOT EXISTS schools (
--   nspn CHAR(8) PRIMARY KEY,
--   type TEXT NOT NULL,
--   name TEXT NOT NULL,
--   city CHAR(6) NOT NULL
-- );

-- primary key -> year(4) + semester(1) + nspn(8)

CREATE TABLE IF NOT EXISTS school_groups(
    id CHAR(13) PRIMARY KEY,
    type VARCHAR(4) CHECK (type = 'sma' or type = 'smp' or type = 'smk'),
    name VARCHAR(50) NOT NULL,
    city CHAR(6) NOT NULL
);

-- users 필드 추가

-- CREATE TABLE IF NOT EXISTS users (
--   id INTEGER PRIMARY KEY AUTO_INCREMENT,
--   name TEXT CHECK (LENGTH(name) <= 30),
--   gender CHAR(1),
--   CHECK (gender = 'm' OR gender = 'f'),
--   grade CHAR(1),
--   CHECK (grade = '1' OR grade ='2' OR grade = '3' OR grade = '4' OR grade = '5' OR grade = '6'),
--   coin INTEGER DEFAULT 0,
--   school JSON,
--   auth JSON,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- 전화번호 필드 추가
-- school_group_id 기록
-- school, nspn 삭제

ALTER TABLE users ADD COLUMN phone VARCHAR(12) UNIQUE;
ALTER TABLE users ADD COLUMN school_group_id VARCHAR(13);
ALTER TABLE users ADD FOREIGN KEY (school_group_id) REFERENCES school_groups(id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_school_group_id ON users(school_group_id);

-- poll answers 변경

-- CREATE TABLE IF NOT EXISTS poll_answers (
--   id INTEGER PRIMARY KEY AUTO_INCREMENT,
--   poll JSON NOT NULL,
--   voter JSON NOT NULL,
--   winner JSON,
--   poll_date CHAR(10) NOT NULL,
--   is_checked BOOLEAN DEFAULT FALSE,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
--   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- primary key uuid로 변경
-- school_group id 추가
-- candidates 추가

ALTER TABLE poll_candidates DROP FOREIGN KEY poll_candidates_ibfk_1;
ALTER TABLE poll_answers MODIFY id INT NOT NULL;
ALTER TABLE poll_answers DROP PRIMARY KEY;
ALTER TABLE poll_answers DROP COLUMN id;
ALTER TABLE poll_answers ADD COLUMN id CHAR(36) PRIMARY KEY;
ALTER TABLE poll_answers ADD COLUMN school_group_id VARCHAR(13) NOT NULL;
ALTER TABLE poll_answers ADD FOREIGN KEY (school_group_id) REFERENCES school_groups(id);
ALTER TABLE poll_answers ADD COLUMN candidates JSON;
CREATE TRIGGER poll_answers_id BEFORE INSERT ON poll_answers
   FOR EACH ROW SET NEW.id = UUID();
ALTER TABLE poll_answers ADD COLUMN winner_phone CHAR(12)
  GENERATED ALWAYS as (TRIM('"' FROM JSON_EXTRACT(winner, '$.phone')));

-- poll premiums 변경
-- school_id -> school_group_id 로 변경
ALTER TABLE poll_premiums DROP FOREIGN KEY poll_premiums_ibfk_1;
ALTER TABLE poll_premiums DROP COLUMN nspn;
ALTER TABLE poll_premiums ADD COLUMN school_group_id CHAR(13) NOT NULL;
ALTER TABLE poll_premiums ADD FOREIGN KEY (school_group_id) REFERENCES school_groups(id);


-- app versioning
INSERT INTO versions(os, version) VALUES ('a','1.0.1'), ('i','1.0.1');


-- promote shorten url
CREATE TABLE IF NOT EXISTS shorten_urls (
  id CHAR(6) PRIMARY KEY,
  poll_answer_id CHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEy (poll_answer_id) REFERENCES poll_answers(id)
);