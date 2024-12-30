-- app versioning
UPDATE versions SET is_enabled=FALSE;
INSERT INTO versions(os, version) VALUES ('a','1.1.0'), ('i','1.1.0');


-- id/password hash

ALTER TABLE users ADD COLUMN account_id CHAR(30)
  GENERATED ALWAYS as (TRIM('"' FROM JSON_EXTRACT(auth, '$.account_id')));
CREATE INDEX users_id on users(account_id);
ALTER TABLE users ADD COLUMN password CHAR(99)
  GENERATED ALWAYS as (TRIM('"' FROM JSON_EXTRACT(auth, '$.password')));