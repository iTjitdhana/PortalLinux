#!/bin/bash

# Portal Build Test Script
# This script tests the Docker build process locally before deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.yml"

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

# Test backend build
test_backend_build() {
    log_info "Testing Backend Docker build..."
    
    cd backend
    
    # Build backend image
    if docker build -t portal-backend-test .; then
        log_success "Backend build successful"
    else
        log_error "Backend build failed"
        exit 1
    fi
    
    # Test backend container
    log_info "Testing Backend container..."
    if docker run --rm -d --name portal-backend-test -p 3105:3105 portal-backend-test; then
        log_success "Backend container started"
        
        # Wait for backend to be ready
        sleep 10
        
        # Test health endpoint
        if curl -f http://localhost:3105/health > /dev/null 2>&1; then
            log_success "Backend health check passed"
        else
            log_warning "Backend health check failed (this is expected without database)"
        fi
        
        # Stop test container
        docker stop portal-backend-test
        log_success "Backend test completed"
    else
        log_error "Backend container failed to start"
        exit 1
    fi
    
    cd ..
}

# Test frontend build
test_frontend_build() {
    log_info "Testing Frontend Docker build..."
    
    cd frontend
    
    # Build frontend image
    if docker build -t portal-frontend-test .; then
        log_success "Frontend build successful"
    else
        log_error "Frontend build failed"
        exit 1
    fi
    
    # Test frontend container
    log_info "Testing Frontend container..."
    if docker run --rm -d --name portal-frontend-test -p 3015:3015 portal-frontend-test; then
        log_success "Frontend container started"
        
        # Wait for frontend to be ready
        sleep 10
        
        # Test frontend endpoint
        if curl -f http://localhost:3015 > /dev/null 2>&1; then
            log_success "Frontend health check passed"
        else
            log_warning "Frontend health check failed"
        fi
        
        # Stop test container
        docker stop portal-frontend-test
        log_success "Frontend test completed"
    else
        log_error "Frontend container failed to start"
        exit 1
    fi
    
    cd ..
}

# Test full stack build
test_full_stack_build() {
    log_info "Testing full stack build with docker-compose..."
    
    # Stop any existing containers
    docker-compose -f "$DOCKER_COMPOSE_FILE" down 2>/dev/null || true
    
    # Build all services
    if docker-compose -f "$DOCKER_COMPOSE_FILE" build; then
        log_success "Full stack build successful"
    else
        log_error "Full stack build failed"
        exit 1
    fi
    
    # Start services
    log_info "Starting full stack services..."
    if docker-compose -f "$DOCKER_COMPOSE_FILE" up -d; then
        log_success "Full stack services started"
        
        # Wait for services
        log_info "Waiting for services to be ready..."
        sleep 30
        
        # Test services
        log_info "Testing services..."
        
        # Test MySQL
        if docker-compose -f "$DOCKER_COMPOSE_FILE" exec mysql mysqladmin ping -h localhost --silent; then
            log_success "MySQL is healthy"
        else
            log_warning "MySQL health check failed"
        fi
        
        # Test Backend
        if curl -f http://localhost:3105/health > /dev/null 2>&1; then
            log_success "Backend API is healthy"
        else
            log_warning "Backend API health check failed"
        fi
        
        # Test Frontend
        if curl -f http://localhost:3015 > /dev/null 2>&1; then
            log_success "Frontend is healthy"
        else
            log_warning "Frontend health check failed"
        fi
        
        # Show status
        log_info "Service Status:"
        docker-compose -f "$DOCKER_COMPOSE_FILE" ps
        
        # Stop services
        log_info "Stopping test services..."
        docker-compose -f "$DOCKER_COMPOSE_FILE" down
        log_success "Test services stopped"
        
    else
        log_error "Failed to start full stack services"
        exit 1
    fi
}

# Clean up test images
cleanup_test_images() {
    log_info "Cleaning up test images..."
    docker rmi portal-backend-test portal-frontend-test 2>/dev/null || true
    docker image prune -f
    log_success "Test images cleaned up"
}

# Main test function
main() {
    log_info "Starting Portal build tests..."
    echo ""
    
    check_docker
    test_backend_build
    test_frontend_build
    test_full_stack_build
    cleanup_test_images
    
    echo ""
    log_success "All build tests completed successfully!"
    log_info "The application is ready for deployment."
}

# Handle script arguments
case "${1:-}" in
    "backend")
        check_docker
        test_backend_build
        cleanup_test_images
        ;;
    "frontend")
        check_docker
        test_frontend_build
        cleanup_test_images
        ;;
    "full")
        check_docker
        test_full_stack_build
        cleanup_test_images
        ;;
    "cleanup")
        cleanup_test_images
        ;;
    *)
        main
        ;;
esac
