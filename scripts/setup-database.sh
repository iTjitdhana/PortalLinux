#!/bin/bash

# Database Setup Script for Portal Linux
echo "🔧 Setting up Portal Database..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    exit 1
fi

# Database credentials
DB_HOST="192.168.0.96"
DB_PORT="3306"
DB_NAME="portal"
DB_USER="jitdhana"
DB_PASSWORD="iT12345$"

echo "📊 Connecting to MySQL..."

# Create database if not exists
mysql -h $DB_HOST -P $DB_PORT -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Create user if not exists
mysql -h $DB_HOST -P $DB_PORT -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';"
mysql -h $DB_HOST -P $DB_PORT -u root -p -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';"
mysql -h $DB_HOST -P $DB_PORT -u root -p -e "FLUSH PRIVILEGES;"

echo "✅ Database setup completed!"
echo "📋 Database Info:"
echo "   Host: $DB_HOST:$DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"

# Test connection
echo "🔍 Testing database connection..."
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed!"
    exit 1
fi
