#!/bin/bash

# Advanced Network Test Script
echo "🔍 Advanced network connectivity test..."

# Test 1: Check if services are accessible from external IPs
echo "🌐 Testing external IP accessibility..."

# Get server's external IP
SERVER_IP="192.168.0.96"
echo "Testing server IP: $SERVER_IP"

# Test from server to itself using external IP
echo "Testing self-connectivity via external IP:"
echo "Frontend ($SERVER_IP:3015):"
if curl -s --connect-timeout 5 http://$SERVER_IP:3015 >/dev/null; then
    echo "  ✅ Accessible"
else
    echo "  ❌ Not accessible"
fi

echo "Backend ($SERVER_IP:3105):"
if curl -s --connect-timeout 5 http://$SERVER_IP:3105/health >/dev/null; then
    echo "  ✅ Accessible"
else
    echo "  ❌ Not accessible"
fi

echo "Nginx ($SERVER_IP:8080):"
if curl -s --connect-timeout 5 http://$SERVER_IP:8080 >/dev/null; then
    echo "  ✅ Accessible"
else
    echo "  ❌ Not accessible"
fi

# Test 2: Check port binding details
echo "📡 Checking detailed port binding..."
if command -v ss >/dev/null 2>&1; then
    echo "Port binding details:"
    ss -tlnp | grep -E ":(3015|3105|8080)"
elif command -v netstat >/dev/null 2>&1; then
    echo "Port binding details:"
    netstat -tlnp | grep -E ":(3015|3105|8080)"
fi

# Test 3: Check Docker network details
echo "🐳 Docker network details..."
docker network inspect web_potralv30_portal_network 2>/dev/null | grep -A 20 "Containers"

# Test 4: Check if there are any iptables rules blocking
echo "🔥 Checking iptables rules..."
if command -v iptables >/dev/null 2>&1; then
    echo "iptables rules for ports 3015, 3105, 8080:"
    iptables -L -n | grep -E "(3015|3105|8080|ACCEPT|DROP|REJECT)"
fi

# Test 5: Check system routing
echo "🛣️  Checking routing table..."
ip route show | head -5

# Test 6: Check if there are any proxy or NAT rules
echo "🔄 Checking for proxy/NAT rules..."
if command -v iptables >/dev/null 2>&1; then
    echo "NAT rules:"
    iptables -t nat -L -n | grep -E "(3015|3105|8080)"
fi

# Test 7: Test with different curl options
echo "🧪 Testing with different curl options..."
echo "Testing with --interface option:"
INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
echo "Using interface: $INTERFACE"

if [ ! -z "$INTERFACE" ]; then
    echo "Frontend with interface binding:"
    if curl -s --interface $INTERFACE --connect-timeout 5 http://$SERVER_IP:3015 >/dev/null; then
        echo "  ✅ Accessible via interface $INTERFACE"
    else
        echo "  ❌ Not accessible via interface $INTERFACE"
    fi
fi

echo "🏁 Advanced network test completed"
