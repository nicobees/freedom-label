#!/bin/bash

set -e

# Default to latest if no version is provided
export BACKEND_VERSION=${1:-latest}
export FRONTEND_VERSION=${2:-latest}

# Pull the latest images
docker-compose pull

# Restart the services
docker-compose up -d --remove-orphans