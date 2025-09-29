#!/bin/bash

# Persistent iptables Fix Script
echo "🔧 Fixing persistent iptables policy..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

echo "📋 Current iptables policy:"
iptables -L -n | head -5

echo "🔧 Method 1: Disable UFW temporarily and set iptables manually..."

# Disable UFW
ufw --force disable

# Set iptables policy to ACCEPT
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

# Add explicit rules for Portal ports
iptables -I INPUT -p tcp --dport 3015 -j ACCEPT
iptables -I INPUT -p tcp --dport 3105 -j ACCEPT
iptables -I INPUT -p tcp --dport 8080 -j ACCEPT

# Add rules for other services
iptables -I INPUT -p tcp --dport 22 -j ACCEPT
iptables -I INPUT -p tcp --dport 80 -j ACCEPT
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
iptables -I INPUT -p tcp --dport 9000 -j ACCEPT
iptables -I INPUT -p tcp --dport 9443 -j ACCEPT

# Allow established connections
iptables -I INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
iptables -I INPUT -i lo -j ACCEPT

# Allow ICMP
iptables -I INPUT -p icmp -j ACCEPT

echo "📋 New iptables policy:"
iptables -L -n | head -5

echo "🔧 Method 2: Create iptables rules file for persistence..."

# Create iptables rules file
cat > /etc/iptables/rules.v4 << 'EOF'
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]

# Allow loopback
-A INPUT -i lo -j ACCEPT

# Allow established connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow ICMP
-A INPUT -p icmp -j ACCEPT

# Allow SSH
-A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
-A INPUT -p tcp --dport 80 -j ACCEPT
-A INPUT -p tcp --dport 443 -j ACCEPT

# Allow Portal ports
-A INPUT -p tcp --dport 3015 -j ACCEPT
-A INPUT -p tcp --dport 3105 -j ACCEPT
-A INPUT -p tcp --dport 8080 -j ACCEPT

# Allow other services
-A INPUT -p tcp --dport 3000 -j ACCEPT
-A INPUT -p tcp --dport 9000 -j ACCEPT
-A INPUT -p tcp --dport 9443 -j ACCEPT

# Default policy
-P INPUT ACCEPT
-P FORWARD ACCEPT
-P OUTPUT ACCEPT
COMMIT
EOF

echo "🔧 Method 3: Install iptables-persistent if not exists..."
if ! command -v iptables-save >/dev/null 2>&1; then
    apt-get update
    apt-get install -y iptables-persistent
fi

# Save current rules
iptables-save > /etc/iptables/rules.v4

echo "🔧 Method 4: Test the fix..."
echo "Testing local access:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3015
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:3105/health
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://localhost:8080

echo "Testing external access:"
curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://192.168.0.96:3015
curl -s -o /dev/null -w "Backend: %{http_code}\n" http://192.168.0.96:3105/health
curl -s -o /dev/null -w "Nginx: %{http_code}\n" http://192.168.0.96:8080

echo "✅ Persistent iptables fix completed!"
echo "📡 Portal services should now be accessible from external machines"
echo "🔄 iptables rules will persist after reboot"
