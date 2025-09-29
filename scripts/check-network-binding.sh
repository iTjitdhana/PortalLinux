#!/bin/bash

# Network Binding Check Script
echo "🔍 Checking network interface binding..."

# Check if running as root for some commands
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Some commands require root privileges"
fi

# Test 1: Check what interfaces ports are bound to
echo "📡 Checking port binding on different interfaces..."

# Check localhost binding
echo "Localhost binding:"
if command -v ss >/dev/null 2>&1; then
    ss -tlnp | grep -E ":(3015|3105|8080)" || echo "No ports found with ss"
elif command -v netstat >/dev/null 2>&1; then
    netstat -tlnp | grep -E ":(3015|3105|8080)" || echo "No ports found with netstat"
else
    echo "Neither ss nor netstat found"
fi

# Test 2: Check Docker port mapping
echo "🐳 Checking Docker port mapping..."
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "(portal|nginx)"

# Test 3: Test binding on different interfaces
echo "🌐 Testing binding on different interfaces..."

# Get all network interfaces
INTERFACES=$(ip -o link show | awk -F': ' '{print $2}' | grep -v lo)

for interface in $INTERFACES; do
    IP=$(ip -o -4 addr show $interface | awk '{print $4}' | cut -d'/' -f1)
    if [ ! -z "$IP" ] && [ "$IP" != "127.0.0.1" ]; then
        echo "Testing interface $interface ($IP):"
        
        # Test Frontend
        if curl -s --connect-timeout 2 http://$IP:3015 >/dev/null 2>&1; then
            echo "  ✅ Frontend ($IP:3015) accessible"
        else
            echo "  ❌ Frontend ($IP:3015) not accessible"
        fi
        
        # Test Backend
        if curl -s --connect-timeout 2 http://$IP:3105/health >/dev/null 2>&1; then
            echo "  ✅ Backend ($IP:3105) accessible"
        else
            echo "  ❌ Backend ($IP:3105) not accessible"
        fi
        
        # Test Nginx
        if curl -s --connect-timeout 2 http://$IP:8080 >/dev/null 2>&1; then
            echo "  ✅ Nginx ($IP:8080) accessible"
        else
            echo "  ❌ Nginx ($IP:8080) not accessible"
        fi
    fi
done

# Test 4: Check Docker network configuration
echo "🔧 Checking Docker network configuration..."
docker network inspect web_potralv30_portal_network 2>/dev/null | jq -r '.[0].IPAM.Config[0].Subnet' 2>/dev/null || echo "Could not get network subnet"

# Test 5: Check if containers are binding to 0.0.0.0
echo "📋 Checking container binding configuration..."
docker exec portal_backend netstat -tlnp 2>/dev/null | grep :3105 || echo "Could not check backend binding"
docker exec portal_frontend netstat -tlnp 2>/dev/null | grep :3015 || echo "Could not check frontend binding"

echo "🏁 Network binding check completed"
