#!/bin/bash

# Network Access Test Script
echo "🔍 Testing network access from different machines..."

# Test 1: Check if containers are accessible from external machines
echo "📡 Testing external access to Portal services..."

# Test Frontend
echo "Testing Frontend (port 3015)..."
if curl -s --connect-timeout 5 http://192.168.0.96:3015 > /dev/null; then
    echo "✅ Frontend accessible from external"
else
    echo "❌ Frontend not accessible from external"
fi

# Test Backend
echo "Testing Backend (port 3105)..."
if curl -s --connect-timeout 5 http://192.168.0.96:3105/health > /dev/null; then
    echo "✅ Backend accessible from external"
else
    echo "❌ Backend not accessible from external"
fi

# Test Nginx
echo "Testing Nginx (port 8080)..."
if curl -s --connect-timeout 5 http://192.168.0.96:8080 > /dev/null; then
    echo "✅ Nginx accessible from external"
else
    echo "❌ Nginx not accessible from external"
fi

# Test 2: Check container network connectivity
echo "🐳 Testing container network connectivity..."

# Test from backend to frontend
echo "Testing backend -> frontend connectivity..."
if docker exec portal_backend wget -qO- http://frontend:3015 > /dev/null 2>&1; then
    echo "✅ Backend can reach frontend"
else
    echo "❌ Backend cannot reach frontend"
fi

# Test from frontend to backend
echo "Testing frontend -> backend connectivity..."
if docker exec portal_frontend wget -qO- http://backend:3105/health > /dev/null 2>&1; then
    echo "✅ Frontend can reach backend"
else
    echo "❌ Frontend cannot reach backend"
fi

# Test 3: Check port binding
echo "🔌 Testing port binding..."
netstat -tlnp | grep -E ":(3015|3105|8080)" || echo "❌ Ports not bound"

echo "🏁 Network access test completed"
