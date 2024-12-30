/*
    Add 'ON DELETE CASCADE' on poll_candidates
*/
alter table poll_candidates drop constraint poll_candidates_ibfk_1;
alter table poll_candidates add constraint poll_candidates_ibfk_1 foreign key (poll_answer_id) references poll_answers(id) on delete cascade;