#!/bin/bash

# Test script to run from external machines
echo "🔍 Testing Portal access from external machine..."

SERVER_IP="192.168.0.96"

# Test 1: Basic connectivity
echo "📡 Testing basic connectivity to server..."
if ping -c 3 $SERVER_IP >/dev/null 2>&1; then
    echo "✅ Server is reachable"
else
    echo "❌ Server is not reachable"
    exit 1
fi

# Test 2: Port connectivity
echo "🔌 Testing port connectivity..."
for port in 3015 3105 8080; do
    if timeout 5 bash -c "</dev/tcp/$SERVER_IP/$port" 2>/dev/null; then
        echo "✅ Port $port is open"
    else
        echo "❌ Port $port is closed or filtered"
    fi
done

# Test 3: HTTP connectivity
echo "🌐 Testing HTTP connectivity..."

echo "Frontend ($SERVER_IP:3015):"
if curl -s --connect-timeout 10 http://$SERVER_IP:3015 >/dev/null; then
    echo "  ✅ Frontend accessible"
    # Get HTTP status code
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3015)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Frontend not accessible"
fi

echo "Backend ($SERVER_IP:3105):"
if curl -s --connect-timeout 10 http://$SERVER_IP:3105/health >/dev/null; then
    echo "  ✅ Backend accessible"
    # Get HTTP status code
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:3105/health)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Backend not accessible"
fi

echo "Nginx ($SERVER_IP:8080):"
if curl -s --connect-timeout 10 http://$SERVER_IP:8080 >/dev/null; then
    echo "  ✅ Nginx accessible"
    # Get HTTP status code
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_IP:8080)
    echo "  📊 HTTP Status: $STATUS"
else
    echo "  ❌ Nginx not accessible"
fi

# Test 4: Detailed error information
echo "🔍 Getting detailed error information..."
echo "Frontend detailed test:"
curl -v --connect-timeout 10 http://$SERVER_IP:3015 2>&1 | head -10

echo "Backend detailed test:"
curl -v --connect-timeout 10 http://$SERVER_IP:3105/health 2>&1 | head -10

echo "🏁 External connectivity test completed"
