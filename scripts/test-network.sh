#!/bin/bash

# Network Test Script for Portal Linux
echo "🔍 Testing network connectivity from Docker containers..."

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

# Test from Docker container
echo "📡 Testing from Docker container..."
docker run --rm --network web_potralv30_portal_network alpine ping -c 3 192.168.0.94

if [ $? -eq 0 ]; then
    echo "✅ Docker container can reach database server"
else
    echo "❌ Docker container cannot reach database server"
    echo "💡 Try using host network mode"
fi

echo "🏁 Network test completed"
