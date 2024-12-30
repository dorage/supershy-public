DROP IF EXISTS TABLE user_otps;
DROP IF EXISTS TABLE school_groups;


ALTER TABLE users DROP COLUMN phone VARCHAR(12) UNIQUE;
ALTER TABLE users DROP COLUMN school_group_id VARCHAR(13);
DROP INDEX idx_users_phone;
DROP INDEX idx_school_group_id;


ALTER TABLE poll_answers DROP PRIMARY KEY;
ALTER TABLE poll_answers DROP COLUMN id;
ALTER TABLE poll_answers ADD COLUMN id INTEGER PRIMARY KEY AUTO_INCREMENT;
ALTER TABLE poll_answers ADD PRIMARY KEY(id);
ALTER TABLE poll_answers DROP COLUMN school_group_id VARCHAR(13) NOT NULL;
ALTER TABLE poll_answers DROP FOREIGN KEY (school_group_id);
ALTER TABLE poll_answers DROP COLUMN candidates;