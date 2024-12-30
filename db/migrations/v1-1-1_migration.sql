-- premiums

CREATE TABLE IF NOT EXISTS premium_histories (
    id CHAR(10) PRIMARY KEY,
    point INTEGER,
    usage VARCHAR(49),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- universities

CREATE TABLE IF NOT EXISTS univ_cities (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS univs (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(20),
    name VARCHAR(99),
    univ_city_id INTEGER,
    FOREIGN KEY (univ_city_id) REFERENCES univ_cities(id)
);
CREATE INDEX IF NOT EXISTS unvis_univ_city_id ON univs(univ_city_id);

-- user actions

CREATE TABLE IF NOT EXISTS user_actions (
    user_id INTEGER PRIMARY KEY,
    first_app_rating BOOLEAN DEFAULT FALSE,
    first_get_vote BOOLEAN DEFAULt FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);