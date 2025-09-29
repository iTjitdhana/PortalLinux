#!/bin/bash

# Network Issues Diagnosis Script
echo "🔍 Diagnosing network access issues..."

# Test 1: Check if services are accessible from localhost
echo "📡 Testing localhost access..."
echo "Frontend (localhost:3015):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3015 && echo " ✅" || echo " ❌"

echo "Backend (localhost:3105):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3105/health && echo " ✅" || echo " ❌"

echo "Nginx (localhost:8080):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 && echo " ✅" || echo " ❌"

# Test 2: Check if services are accessible from external IP
echo "🌐 Testing external IP access..."
EXTERNAL_IP=$(hostname -I | awk '{print $1}')
echo "External IP: $EXTERNAL_IP"

echo "Frontend ($EXTERNAL_IP:3015):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:3015 && echo " ✅" || echo " ❌"

echo "Backend ($EXTERNAL_IP:3105):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:3105/health && echo " ✅" || echo " ❌"

echo "Nginx ($EXTERNAL_IP:8080):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:8080 && echo " ✅" || echo " ❌"

# Test 3: Check port binding
echo "🔌 Checking port binding..."
netstat -tlnp | grep -E ":(3015|3105|8080)" || echo "❌ Ports not bound"

# Test 4: Check Docker network
echo "🐳 Checking Docker network..."
docker network ls | grep portal
docker network inspect web_potralv30_portal_network 2>/dev/null | grep -A 5 "Containers"

# Test 5: Check firewall status
echo "🔥 Checking firewall status..."
if command -v ufw >/dev/null 2>&1; then
    ufw status
elif command -v firewall-cmd >/dev/null 2>&1; then
    firewall-cmd --list-all
elif command -v iptables >/dev/null 2>&1; then
    iptables -L | head -10
else
    echo "No firewall tool found"
fi

# Test 6: Check if ports are listening on all interfaces
echo "📡 Checking if ports are listening on all interfaces..."
ss -tlnp | grep -E ":(3015|3105|8080)" || echo "❌ Ports not listening"

echo "🏁 Network diagnosis completed"
