#!/bin/bash

# Portal Linux Deployment Script
# This script deploys the Portal application to a Linux server using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="portal"
DOCKER_COMPOSE_FILE="docker-compose.yml"
DOCKER_COMPOSE_PROD_FILE="docker-compose.prod.yml"
ENV_FILE="env.production"

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

# Check if Docker is installed
check_docker() {
    log_info "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Docker and Docker Compose are installed"
}

# Check if environment file exists
check_env_file() {
    log_info "Checking environment file..."
    if [ ! -f "$ENV_FILE" ]; then
        log_warning "Environment file $ENV_FILE not found. Creating from template..."
        cp env.production.example "$ENV_FILE" 2>/dev/null || {
            log_error "Please create $ENV_FILE with your production configuration"
            exit 1
        }
    fi
    log_success "Environment file found"
}

# Stop existing containers
stop_containers() {
    log_info "Stopping existing containers..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down 2>/dev/null || true
    docker-compose -f "$DOCKER_COMPOSE_PROD_FILE" down 2>/dev/null || true
    log_success "Existing containers stopped"
}

# Build and start containers
deploy_application() {
    log_info "Building and starting application..."
    
    # Pull latest images
    docker-compose -f "$DOCKER_COMPOSE_PROD_FILE" pull
    
    # Build and start services
    docker-compose -f "$DOCKER_COMPOSE_PROD_FILE" up -d --build
    
    log_success "Application deployed successfully"
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for MySQL
    log_info "Waiting for MySQL..."
    timeout 60 bash -c 'until docker-compose -f docker-compose.prod.yml exec mysql mysqladmin ping -h localhost --silent; do sleep 2; done'
    
    # Wait for Backend
    log_info "Waiting for Backend API..."
    timeout 60 bash -c 'until curl -f http://localhost:3105/health > /dev/null 2>&1; do sleep 2; done'
    
    # Wait for Frontend
    log_info "Waiting for Frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:3015 > /dev/null 2>&1; do sleep 2; done'
    
    log_success "All services are healthy"
}

# Show deployment status
show_status() {
    log_info "Deployment Status:"
    echo ""
    docker-compose -f "$DOCKER_COMPOSE_PROD_FILE" ps
    echo ""
    log_info "Application URLs:"
    echo "  Frontend: http://localhost:3015"
    echo "  Backend API: http://localhost:3105"
    echo "  Health Check: http://localhost:3105/health"
    echo ""
}

# Clean up old images
cleanup() {
    log_info "Cleaning up old Docker images..."
    docker image prune -f
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log_info "Starting Portal Linux deployment..."
    echo ""
    
    check_docker
    check_env_file
    stop_containers
    deploy_application
    wait_for_services
    show_status
    cleanup
    
    echo ""
    log_success "Portal deployment completed successfully!"
    log_info "You can now access your application at http://localhost:3015"
}

# Handle script arguments
case "${1:-}" in
    "stop")
        log_info "Stopping Portal application..."
        stop_containers
        log_success "Application stopped"
        ;;
    "restart")
        log_info "Restarting Portal application..."
        stop_containers
        deploy_application
        wait_for_services
        show_status
        log_success "Application restarted"
        ;;
    "status")
        show_status
        ;;
    "logs")
        docker-compose -f "$DOCKER_COMPOSE_PROD_FILE" logs -f
        ;;
    "cleanup")
        cleanup
        ;;
    *)
        main
        ;;
esac
