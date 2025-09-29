#!/bin/bash

# Network Fix Script for Portal Linux
echo "🔧 Fixing network connectivity..."

# Check if we can reach the database server
echo "🔍 Testing database connectivity..."
ping -c 3 192.168.0.94

if [ $? -eq 0 ]; then
    echo "✅ Database server is reachable"
else
    echo "❌ Database server is not reachable"
    echo "🔧 Trying to fix network routing..."
    
    # Add route if needed
    sudo route add -net 192.168.0.0/24 gw 192.168.0.1 2>/dev/null || true
    
    # Test again
    ping -c 3 192.168.0.94
    if [ $? -eq 0 ]; then
        echo "✅ Network routing fixed"
    else
        echo "❌ Network routing failed"
        echo "💡 Consider using Docker MySQL instead"
    fi
fi

# Test MySQL connection
echo "🔍 Testing MySQL connection..."
mysql -h 192.168.0.94 -u jitdhana -piT12345$ -e "SELECT 1;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ MySQL connection successful"
else
    echo "❌ MySQL connection failed"
    echo "💡 Consider using Docker MySQL instead"
fi

echo "🏁 Network check completed"
