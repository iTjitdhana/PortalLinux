#!/bin/bash

# Network Cleanup Script for Portal Linux
echo "🧹 Cleaning up Docker networks..."

# Remove unused networks
echo "🔍 Removing unused networks..."
docker network prune -f

# List all networks
echo "📋 Current Docker networks:"
docker network ls

# Remove specific network if exists
echo "🗑️ Removing portal network if exists..."
docker network rm portal_portal_network 2>/dev/null || true

# Remove all networks with portal in name
echo "🗑️ Removing all portal networks..."
docker network ls --filter name=portal -q | xargs -r docker network rm 2>/dev/null || true

echo "✅ Network cleanup completed"
echo "📋 Remaining networks:"
docker network ls
