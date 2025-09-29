#!/bin/bash

# Linux Server Setup Script for Portal
# This script sets up a Linux server for running the Portal application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system packages
update_system() {
    log_info "Updating system packages..."
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get upgrade -y
        log_success "System packages updated (Ubuntu/Debian)"
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum update -y
        log_success "System packages updated (CentOS/RHEL)"
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf update -y
        log_success "System packages updated (Fedora)"
    else
        log_warning "Package manager not recognized. Please update manually."
    fi
}

# Install Docker
install_docker() {
    log_info "Installing Docker..."
    
    if command -v docker &> /dev/null; then
        log_success "Docker is already installed"
        return
    fi
    
    if command -v apt-get &> /dev/null; then
        # Ubuntu/Debian
        sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    elif command -v dnf &> /dev/null; then
        # Fedora
        sudo dnf install -y dnf-plugins-core
        sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
        sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    fi
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    log_success "Docker installed successfully"
    log_warning "Please log out and log back in for Docker group changes to take effect"
}

# Install Docker Compose (standalone)
install_docker_compose() {
    log_info "Installing Docker Compose..."
    
    if command -v docker-compose &> /dev/null; then
        log_success "Docker Compose is already installed"
        return
    fi
    
    # Download Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    log_success "Docker Compose installed successfully"
}

# Install Git
install_git() {
    log_info "Installing Git..."
    
    if command -v git &> /dev/null; then
        log_success "Git is already installed"
        return
    fi
    
    if command -v apt-get &> /dev/null; then
        sudo apt-get install -y git
    elif command -v yum &> /dev/null; then
        sudo yum install -y git
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y git
    fi
    
    log_success "Git installed successfully"
}

# Install additional tools
install_tools() {
    log_info "Installing additional tools..."
    
    local tools=("curl" "wget" "unzip" "htop" "vim" "nano")
    
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get install -y "$tool"
            elif command -v yum &> /dev/null; then
                sudo yum install -y "$tool"
            elif command -v dnf &> /dev/null; then
                sudo dnf install -y "$tool"
            fi
        fi
    done
    
    log_success "Additional tools installed"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian with UFW
        sudo ufw allow 22/tcp    # SSH
        sudo ufw allow 80/tcp    # HTTP
        sudo ufw allow 443/tcp   # HTTPS
        sudo ufw allow 3015/tcp  # Frontend
        sudo ufw allow 3105/tcp  # Backend
        sudo ufw --force enable
        log_success "UFW firewall configured"
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/RHEL/Fedora with firewalld
        sudo systemctl start firewalld
        sudo systemctl enable firewalld
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --permanent --add-port=3015/tcp
        sudo firewall-cmd --permanent --add-port=3105/tcp
        sudo firewall-cmd --reload
        log_success "Firewalld configured"
    else
        log_warning "Firewall not configured. Please configure manually."
    fi
}

# Create application directory
create_app_directory() {
    log_info "Creating application directory..."
    
    local app_dir="/opt/portal"
    
    if [ ! -d "$app_dir" ]; then
        sudo mkdir -p "$app_dir"
        sudo chown $USER:$USER "$app_dir"
        log_success "Application directory created: $app_dir"
    else
        log_success "Application directory already exists: $app_dir"
    fi
}

# Setup log rotation
setup_log_rotation() {
    log_info "Setting up log rotation..."
    
    sudo tee /etc/logrotate.d/portal > /dev/null <<EOF
/opt/portal/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
    
    log_success "Log rotation configured"
}

# Create systemd service (optional)
create_systemd_service() {
    log_info "Creating systemd service..."
    
    sudo tee /etc/systemd/system/portal.service > /dev/null <<EOF
[Unit]
Description=Portal Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/portal
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$USER

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable portal.service
    
    log_success "Systemd service created and enabled"
}

# Main setup function
main() {
    log_info "Starting Linux server setup for Portal..."
    echo ""
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        log_error "Please do not run this script as root. Run as a regular user with sudo privileges."
        exit 1
    fi
    
    # Check sudo privileges
    if ! sudo -n true 2>/dev/null; then
        log_error "This script requires sudo privileges. Please run with sudo access."
        exit 1
    fi
    
    update_system
    install_docker
    install_docker_compose
    install_git
    install_tools
    configure_firewall
    create_app_directory
    setup_log_rotation
    create_systemd_service
    
    echo ""
    log_success "Linux server setup completed successfully!"
    echo ""
    log_info "Next steps:"
    echo "1. Log out and log back in to apply Docker group changes"
    echo "2. Clone the Portal repository to /opt/portal"
    echo "3. Configure environment variables"
    echo "4. Run the deployment script"
    echo ""
    log_info "To start the application: sudo systemctl start portal"
    log_info "To check status: sudo systemctl status portal"
}

# Handle script arguments
case "${1:-}" in
    "docker")
        install_docker
        install_docker_compose
        ;;
    "firewall")
        configure_firewall
        ;;
    "service")
        create_systemd_service
        ;;
    *)
        main
        ;;
esac
