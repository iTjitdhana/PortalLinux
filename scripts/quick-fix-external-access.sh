#!/bin/bash

# Quick Fix for External Access
echo "🚀 Quick fix for external access..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "🔧 Step 1: Fix iptables policy..."
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT

echo "🔧 Step 2: Reload UFW..."
ufw --force reload

echo "🔧 Step 3: Restart Docker containers..."
cd /opt/portal
docker compose down
docker compose up -d

echo "🔧 Step 4: Wait for containers to start..."
sleep 10

echo "🔧 Step 5: Verify services..."
echo "Testing local access:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3015
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:3105/health
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://localhost:8080

echo "Testing external access:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://192.168.0.96:3015
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://192.168.0.96:3105/health
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://192.168.0.96:8080

echo "✅ Quick fix completed!"
echo "📡 Portal services should now be accessible from external machines:"
echo "  - Frontend: http://192.168.0.96:3015"
echo "  - Backend: http://192.168.0.96:3105"
echo "  - Nginx: http://192.168.0.96:8080"
