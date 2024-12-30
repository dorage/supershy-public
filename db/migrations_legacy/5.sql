DROP TABLE IF EXISTS school_students;

CREATE TABLE IF NOT EXISTS school_students (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  nspn CHAR(8) NOT NULL,
  grade CHAR(1) NOT NULL,
  students JSON NOT NULL,
  recent_answers JSON NOT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (nspn) REFERENCES schools(nspn)
);
CREATE INDEX idx_school_students_nspn_grade on school_students (nspn, grade);