#!/bin/bash

# iptables Policy Fix Script
echo "🔧 Fixing iptables policy issues..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "📋 Current iptables policy:"
iptables -L -n | head -5

echo "🔧 Fixing iptables policy..."

# Method 1: Change INPUT policy to ACCEPT (temporary fix)
echo "Setting INPUT policy to ACCEPT (temporary)..."
iptables -P INPUT ACCEPT

# Method 2: Ensure UFW rules are properly applied
echo "Reloading UFW rules..."
ufw --force reload

# Method 3: Check if there are conflicting rules
echo "📋 Checking for conflicting rules..."
iptables -L -n | grep -E "(DROP|REJECT)" | head -10

# Method 4: Add explicit ACCEPT rules for Portal ports
echo "Adding explicit ACCEPT rules for Portal ports..."
iptables -I INPUT -p tcp --dport 3015 -j ACCEPT
iptables -I INPUT -p tcp --dport 3105 -j ACCEPT
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

# Method 5: Check Docker network
echo "🐳 Checking Docker network..."
docker network ls | grep portal

# If network doesn't exist, recreate it
if ! docker network ls | grep -q portal; then
    echo "Creating missing Docker network..."
    docker network create portal_network
fi

# Method 6: Restart Docker containers to use correct network
echo "🔄 Restarting Docker containers..."
cd /opt/portal
docker compose down
docker compose up -d

# Method 7: Verify the fix
echo "✅ Verifying the fix..."
echo "New iptables policy:"
iptables -L -n | head -5

echo "Docker containers status:"
docker compose ps

echo "Port binding check:"
ss -tlnp | grep -E ":(3015|3105|8080)"

echo "🏁 iptables policy fix completed"
echo "📡 Portal services should now be accessible from external machines"
