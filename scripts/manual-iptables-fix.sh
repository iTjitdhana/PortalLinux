#!/bin/bash

# Manual iptables Fix Script
echo "🔧 Manual iptables fix..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "📋 Current iptables policy:"
iptables -L -n | head -3

echo "🔧 Step 1: Disable UFW..."
ufw --force disable

echo "🔧 Step 2: Set iptables policy to ACCEPT..."
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

echo "🔧 Step 3: Add Portal port rules..."
iptables -I INPUT -p tcp --dport 3015 -j ACCEPT
iptables -I INPUT -p tcp --dport 3105 -j ACCEPT
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

echo "🔧 Step 4: Add essential rules..."
iptables -I INPUT -p tcp --dport 22 -j ACCEPT
iptables -I INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -I INPUT -i lo -j ACCEPT

echo "📋 New iptables policy:"
iptables -L -n | head -3

echo "🔧 Step 5: Test connectivity..."
echo "Testing external access:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://192.168.0.96:3015
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://192.168.0.96:3105/health
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://192.168.0.96:8080

echo "✅ Manual iptables fix completed!"
echo "📡 Portal services should now be accessible from external machines"
echo "⚠️  Note: UFW is disabled. Use iptables directly for firewall management."
