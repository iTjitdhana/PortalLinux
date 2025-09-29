#!/bin/bash

# Network Interface Fix Script
echo "🔧 Fixing network interface binding issues..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Test 1: Check current network interfaces
echo "📡 Checking network interfaces..."
ip addr show | grep -E "inet.*192\.168\.0\." | head -5

# Test 2: Check Docker network configuration
echo "🐳 Checking Docker network configuration..."
docker network inspect web_potralv30_portal_network 2>/dev/null | grep -A 10 "IPAM"

# Test 3: Check if there are any iptables rules blocking
echo "🔥 Checking iptables rules..."
iptables -L -n | grep -E "(3015|3105|8080|ACCEPT|DROP|REJECT)"

# Test 4: Check for any proxy or NAT rules
echo "🔄 Checking NAT rules..."
iptables -t nat -L -n | grep -E "(3015|3105|8080)"

# Test 5: Check system routing
echo "🛣️  Checking routing table..."
ip route show | grep -E "(192\.168\.0|default)"

# Test 6: Check if Docker is binding to correct interface
echo "🐳 Checking Docker port binding..."
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "(portal|nginx)"

# Test 7: Test connectivity from different angles
echo "🧪 Testing connectivity from different angles..."

# Get the main network interface
MAIN_INTERFACE=$(ip route | grep default | awk '{print $5}' | head -1)
echo "Main interface: $MAIN_INTERFACE"

# Get the IP of the main interface
MAIN_IP=$(ip -o -4 addr show $MAIN_INTERFACE | awk '{print $4}' | cut -d'/' -f1)
echo "Main IP: $MAIN_IP"

# Test if we can reach the services via the main IP
echo "Testing via main IP ($MAIN_IP):"
for port in 3015 3105 8080; do
    if curl -s --connect-timeout 5 http://$MAIN_IP:$port >/dev/null 2>&1; then
        echo "  ✅ Port $port accessible via $MAIN_IP"
    else
        echo "  ❌ Port $port not accessible via $MAIN_IP"
    fi
done

# Test 8: Check if there are any systemd or other services interfering
echo "🔍 Checking for interfering services..."
systemctl list-units --type=service | grep -E "(docker|nginx|apache|httpd)" | head -5

# Test 9: Check Docker daemon configuration
echo "🐳 Checking Docker daemon configuration..."
if [ -f /etc/docker/daemon.json ]; then
    echo "Docker daemon.json exists:"
    cat /etc/docker/daemon.json
else
    echo "No Docker daemon.json found"
fi

# Test 10: Check if there are any network namespaces
echo "🌐 Checking network namespaces..."
ip netns list 2>/dev/null || echo "No network namespaces found"

echo "🏁 Network interface fix check completed"
