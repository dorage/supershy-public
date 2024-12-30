ALTER TABLE poll_answers DROP COLUMN voter_id;
ALTER TABLE poll_answers DROP COLUMN winner_id;

ALTER TABLE poll_answers ADD COLUMN voter_id INTEGER
  GENERATED ALWAYS as (TRIM('"' FROM JSON_EXTRACT(voter, '$.id')));
ALTER TABLE poll_answers ADD COLUMN winner_id INTEGER
  GENERATED ALWAYS as (TRIM('"' FROM JSON_EXTRACT(winner, '$.id')));