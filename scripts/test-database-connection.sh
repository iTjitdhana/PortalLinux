#!/bin/bash

# Database Connection Test Script
echo "🔍 Testing database connection from Docker containers..."

# Test from host
echo "📡 Testing from host (192.168.0.96)..."
ping -c 3 192.168.0.94

if [ $? -eq 0 ]; then
    echo "✅ Host can reach database server"
else
    echo "❌ Host cannot reach database server"
fi

# Test MySQL connection from host
echo "🔍 Testing MySQL connection from host..."
mysql -h 192.168.0.94 -u jitdhana -piT12345$ -e "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Host can connect to MySQL"
else
    echo "❌ Host cannot connect to MySQL"
fi

# Test from Docker container with host network
echo "📡 Testing from Docker container (host network)..."
docker run --rm --network host alpine ping -c 3 192.168.0.94

if [ $? -eq 0 ]; then
    echo "✅ Docker container (host network) can reach database server"
else
    echo "❌ Docker container (host network) cannot reach database server"
fi

# Test MySQL connection from Docker container
echo "🔍 Testing MySQL connection from Docker container..."
docker run --rm --network host mysql:8.0 mysql -h 192.168.0.94 -u jitdhana -piT12345$ -e "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Docker container can connect to MySQL"
else
    echo "❌ Docker container cannot connect to MySQL"
fi

echo "🏁 Database connection test completed"
