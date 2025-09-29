#!/bin/bash

# Firewall Configuration Script for Portal System
echo "🔥 Configuring firewall for Portal system..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Detect firewall system
if command -v ufw >/dev/null 2>&1; then
    echo "📋 Using UFW firewall..."
    
    # Enable UFW if not already enabled
    ufw --force enable
    
    # Allow SSH (important!)
    ufw allow 22/tcp comment "SSH"
    
    # Allow Portal ports
    ufw allow 3015/tcp comment "Portal Frontend"
    ufw allow 3105/tcp comment "Portal Backend"
    ufw allow 8080/tcp comment "Portal Nginx"
    
    # Allow other services (optional)
    ufw allow 3000/tcp comment "Grafana"
    ufw allow 9000/tcp comment "Portainer"
    ufw allow 9443/tcp comment "Portainer HTTPS"
    
    # Show status
    echo "✅ UFW rules added. Current status:"
    ufw status numbered
    
elif command -v firewall-cmd >/dev/null 2>&1; then
    echo "📋 Using firewalld..."
    
    # Start and enable firewalld
    systemctl start firewalld
    systemctl enable firewalld
    
    # Add Portal ports
    firewall-cmd --permanent --add-port=3015/tcp
    firewall-cmd --permanent --add-port=3105/tcp
    firewall-cmd --permanent --add-port=8080/tcp
    
    # Add other services (optional)
    firewall-cmd --permanent --add-port=3000/tcp
    firewall-cmd --permanent --add-port=9000/tcp
    firewall-cmd --permanent --add-port=9443/tcp
    
    # Reload firewall
    firewall-cmd --reload
    
    # Show status
    echo "✅ Firewalld rules added. Current status:"
    firewall-cmd --list-all
    
elif command -v iptables >/dev/null 2>&1; then
    echo "📋 Using iptables..."
    
    # Allow Portal ports
    iptables -A INPUT -p tcp --dport 3015 -j ACCEPT
    iptables -A INPUT -p tcp --dport 3105 -j ACCEPT
    iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
    
    # Allow other services (optional)
    iptables -A INPUT -p tcp --dport 3000 -j ACCEPT
    iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
    iptables -A INPUT -p tcp --dport 9443 -j ACCEPT
    
    # Save iptables rules (method varies by distribution)
    if command -v iptables-save >/dev/null 2>&1; then
        iptables-save > /etc/iptables/rules.v4 2>/dev/null || \
        iptables-save > /etc/sysconfig/iptables 2>/dev/null || \
        echo "⚠️  Please save iptables rules manually"
    fi
    
    echo "✅ iptables rules added. Current status:"
    iptables -L -n | grep -E "(3015|3105|8080|3000|9000|9443)"
    
else
    echo "❌ No supported firewall system found"
    echo "Please manually configure firewall to allow ports:"
    echo "  - 3015 (Portal Frontend)"
    echo "  - 3105 (Portal Backend)"
    echo "  - 8080 (Portal Nginx)"
    echo "  - 3000 (Grafana)"
    echo "  - 9000 (Portainer)"
    echo "  - 9443 (Portainer HTTPS)"
    exit 1
fi

echo "🎉 Firewall configuration completed!"
echo "📡 Portal services should now be accessible from other machines:"
echo "  - Frontend: http://192.168.0.96:3015"
echo "  - Backend: http://192.168.0.96:3105"
echo "  - Nginx: http://192.168.0.96:8080"
