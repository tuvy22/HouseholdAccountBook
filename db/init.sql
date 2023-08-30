CREATE DATABASE IF NOT EXISTS devdb;

USE devdb;

CREATE TABLE IF NOT EXISTS expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50),
    amount DECIMAL(10, 2),
    memo TEXT,
    date DATE
);
