-- Fix MySQL Connection Issues
-- Run this on the MySQL server (192.168.0.94)

-- 1. Create user with mysql_native_password authentication
CREATE USER IF NOT EXISTS 'jitdhana'@'%' IDENTIFIED WITH mysql_native_password BY 'iT12345$';
CREATE USER IF NOT EXISTS 'jitdhana'@'localhost' IDENTIFIED WITH mysql_native_password BY 'iT12345$';

-- 2. Grant all privileges
GRANT ALL PRIVILEGES ON portal.* TO 'jitdhana'@'%';
GRANT ALL PRIVILEGES ON portal.* TO 'jitdhana'@'localhost';

-- 3. Flush privileges
FLUSH PRIVILEGES;

-- 4. Check user authentication method
SELECT user, host, plugin FROM mysql.user WHERE user = 'jitdhana';

-- 5. Test connection
SELECT 'Connection test successful' as status;
