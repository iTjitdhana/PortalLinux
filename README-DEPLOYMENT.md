# Portal Linux Deployment Guide

This guide explains how to deploy the Portal application to a Linux server using Docker.

## 🚀 Quick Start

### Prerequisites

- Linux server (Ubuntu 20.04+, CentOS 8+, or similar)
- Root or sudo access
- Internet connection

### 1. Server Setup

Run the server setup script to install Docker and configure the system:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/iTjitdhana/PortalLinux/main/scripts/setup-server.sh | bash

# Or clone the repository and run locally
git clone https://github.com/iTjitdhana/PortalLinux.git
cd PortalLinux
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

### 2. Deploy Application

```bash
# Clone the repository
git clone https://github.com/iTjitdhana/PortalLinux.git
cd PortalLinux

# Configure environment variables
cp env.production.example env.production
nano env.production  # Edit with your settings

# Deploy the application
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 3. Access Application

- **Frontend**: http://your-server-ip:3015
- **Backend API**: http://your-server-ip:3105
- **Health Check**: http://your-server-ip:3105/health

## 📋 Manual Setup

If you prefer to set up manually:

### Install Docker

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# CentOS/RHEL
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Start Docker

```bash
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### Deploy Application

```bash
# Clone repository
git clone https://github.com/iTjitdhana/PortalLinux.git
cd PortalLinux

# Configure environment
cp env.production.example env.production
# Edit env.production with your settings

# Deploy
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 Configuration

### Environment Variables

Edit `env.production` with your settings:

```env
# Database Configuration
DB_NAME=portal
DB_USER=jitdhana
DB_PASSWORD=your-secure-password
DB_ROOT_PASSWORD=your-root-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Server Configuration
FRONTEND_URL=http://your-domain.com
BACKEND_URL=http://your-domain.com:3105
```

### SSL/HTTPS Setup

1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `nginx/ssl/` directory
3. Uncomment SSL configuration in `nginx/nginx.prod.conf`
4. Update environment variables for HTTPS URLs

## 🛠️ Management Commands

### Using Deployment Script

```bash
# Deploy application
./scripts/deploy.sh

# Stop application
./scripts/deploy.sh stop

# Restart application
./scripts/deploy.sh restart

# Check status
./scripts/deploy.sh status

# View logs
./scripts/deploy.sh logs

# Clean up old images
./scripts/deploy.sh cleanup
```

### Using Docker Compose

```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose -f docker-compose.prod.yml down

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# Update and rebuild
docker-compose -f docker-compose.prod.yml up -d --build
```

### Using Systemd Service

```bash
# Start application
sudo systemctl start portal

# Stop application
sudo systemctl stop portal

# Check status
sudo systemctl status portal

# Enable auto-start
sudo systemctl enable portal
```

## 🔍 Monitoring

### Health Checks

- **Backend**: `curl http://localhost:3105/health`
- **Frontend**: `curl http://localhost:3015`
- **Database**: `docker-compose -f docker-compose.prod.yml exec mysql mysqladmin ping -h localhost`

### Logs

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs -f

# Specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f mysql

# System logs
sudo journalctl -u portal -f
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up
docker system prune -a
```

## 🔒 Security

### Firewall Configuration

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### SSL/TLS

1. Install Certbot:
```bash
sudo apt-get install certbot  # Ubuntu/Debian
sudo yum install certbot      # CentOS/RHEL
```

2. Obtain certificate:
```bash
sudo certbot certonly --standalone -d your-domain.com
```

3. Configure nginx for SSL (see nginx configuration files)

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo netstat -tulpn | grep :3015
   sudo netstat -tulpn | grep :3105
   ```

2. **Permission denied**:
   ```bash
   sudo chown -R $USER:$USER /opt/portal
   sudo chmod +x scripts/*.sh
   ```

3. **Database connection failed**:
   ```bash
   docker-compose -f docker-compose.prod.yml logs mysql
   docker-compose -f docker-compose.prod.yml exec mysql mysql -u root -p
   ```

4. **Out of disk space**:
   ```bash
   docker system prune -a
   docker volume prune
   ```

### Reset Everything

```bash
# Stop and remove all containers
docker-compose -f docker-compose.prod.yml down -v

# Remove all images
docker rmi $(docker images -q)

# Remove all volumes
docker volume prune -f

# Start fresh
./scripts/deploy.sh
```

## 📞 Support

For issues and support:
- Check logs: `./scripts/deploy.sh logs`
- Review this documentation
- Create an issue on GitHub

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
./scripts/deploy.sh restart
```

## 📊 Performance Tuning

### Database Optimization

```sql
-- MySQL optimization queries
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 200;
```

### Nginx Optimization

Edit `nginx/nginx.prod.conf` for your server specs:

```nginx
worker_processes auto;
worker_connections 1024;
```

### Docker Resource Limits

Add to `docker-compose.prod.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```
