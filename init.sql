CREATE DATABASE IF NOT EXISTS fitness_db;
USE fitness_db;

-- Table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Table sessions
CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATETIME NOT NULL,
    duration INT NOT NULL COMMENT 'Duration in minutes',
    FOREIGN KEY (user_id) REFERENCES users(id)
);