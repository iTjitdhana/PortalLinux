#!/bin/bash

# Simple External Test Script
echo "🔍 Simple external connectivity test..."

SERVER_IP="192.168.0.96"

# Test 1: Basic ping
echo "📡 Testing ping to server..."
if ping -c 3 $SERVER_IP >/dev/null 2>&1; then
    echo "✅ Server is reachable via ping"
else
    echo "❌ Server is not reachable via ping"
    exit 1
fi

# Test 2: Port connectivity using telnet
echo "🔌 Testing port connectivity..."
for port in 3015 3105 8080; do
    echo "Testing port $port..."
    if timeout 5 bash -c "echo > /dev/tcp/$SERVER_IP/$port" 2>/dev/null; then
        echo "  ✅ Port $port is open"
    else
        echo "  ❌ Port $port is closed or filtered"
    fi
done

# Test 3: HTTP connectivity
echo "🌐 Testing HTTP connectivity..."

echo "Frontend ($SERVER_IP:3015):"
if curl -s --connect-timeout 10 http://$SERVER_IP:3015 >/dev/null; then
    echo "  ✅ Frontend accessible"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3015)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Frontend not accessible"
    echo "  🔍 Error details:"
    curl -v --connect-timeout 10 http://$SERVER_IP:3015 2>&1 | head -5
fi

echo "Backend ($SERVER_IP:3105):"
if curl -s --connect-timeout 10 http://$SERVER_IP:3105/health >/dev/null; then
    echo "  ✅ Backend accessible"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3105/health)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Backend not accessible"
    echo "  🔍 Error details:"
    curl -v --connect-timeout 10 http://$SERVER_IP:3105/health 2>&1 | head -5
fi

echo "Nginx ($SERVER_IP:8080):"
if curl -s --connect-timeout 10 http://$SERVER_IP:8080 >/dev/null; then
    echo "  ✅ Nginx accessible"
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Nginx not accessible"
    echo "  🔍 Error details:"
    curl -v --connect-timeout 10 http://$SERVER_IP:8080 2>&1 | head -5
fi

# Test 4: Check if it's a DNS issue
echo "🔍 Testing DNS resolution..."
if nslookup $SERVER_IP >/dev/null 2>&1; then
    echo "✅ DNS resolution works"
else
    echo "❌ DNS resolution failed"
fi

# Test 5: Check routing
echo "🛣️  Checking routing to server..."
if traceroute -m 5 $SERVER_IP >/dev/null 2>&1; then
    echo "✅ Routing to server works"
    traceroute -m 3 $SERVER_IP 2>/dev/null | head -5
else
    echo "❌ Routing to server failed"
fi

echo "🏁 Simple external test completed"
