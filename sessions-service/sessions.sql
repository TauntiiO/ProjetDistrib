CREATE DATABASE IF NOT EXISTS sessions_db;

USE sessions_db;

CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATETIME NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes'
);