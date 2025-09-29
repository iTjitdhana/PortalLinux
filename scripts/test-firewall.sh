#!/bin/bash

# Firewall Test Script
echo "🔍 Testing firewall configuration..."

# Test 1: Check if ports are listening
echo "📡 Checking if ports are listening on all interfaces..."
netstat -tlnp | grep -E ":(3015|3105|8080)" || echo "❌ Ports not listening"

# Test 2: Check firewall status
echo "🔥 Checking firewall status..."
if command -v ufw >/dev/null 2>&1; then
    echo "UFW Status:"
    ufw status
elif command -v firewall-cmd >/dev/null 2>&1; then
    echo "Firewalld Status:"
    firewall-cmd --list-all
elif command -v iptables >/dev/null 2>&1; then
    echo "iptables Status:"
    iptables -L -n | grep -E "(3015|3105|8080|ACCEPT|DROP)"
else
    echo "No firewall tool found"
fi

# Test 3: Test local access
echo "🏠 Testing local access..."
echo "Frontend (localhost:3015):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3015 && echo " ✅" || echo " ❌"

echo "Backend (localhost:3105):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3105/health && echo " ✅" || echo " ❌"

echo "Nginx (localhost:8080):"
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 && echo " ✅" || echo " ❌"

# Test 4: Test external access
echo "🌐 Testing external access..."
EXTERNAL_IP=$(hostname -I | awk '{print $1}')
echo "External IP: $EXTERNAL_IP"

echo "Frontend ($EXTERNAL_IP:3015):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:3015 && echo " ✅" || echo " ❌"

echo "Backend ($EXTERNAL_IP:3105):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:3105/health && echo " ✅" || echo " ❌"

echo "Nginx ($EXTERNAL_IP:8080):"
curl -s -o /dev/null -w "%{http_code}" http://$EXTERNAL_IP:8080 && echo " ✅" || echo " ❌"

# Test 5: Check Docker network
echo "🐳 Checking Docker network..."
docker network ls | grep portal
docker network inspect web_potralv30_portal_network 2>/dev/null | grep -A 10 "Containers"

echo "🏁 Firewall test completed"
