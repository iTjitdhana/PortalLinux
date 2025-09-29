-- Fix Database Access for Portal Linux
-- Run this on MySQL server at 192.168.0.96

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'jitdhana'@'%' IDENTIFIED BY 'iT12345$';

-- Grant all privileges
GRANT ALL PRIVILEGES ON portal.* TO 'jitdhana'@'%';

-- Also grant for localhost
CREATE USER IF NOT EXISTS 'jitdhana'@'localhost' IDENTIFIED BY 'iT12345$';
GRANT ALL PRIVILEGES ON portal.* TO 'jitdhana'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases
SHOW DATABASES;

-- Show users
SELECT User, Host FROM mysql.user WHERE User = 'jitdhana';

-- Test connection
USE portal;
SHOW TABLES;
