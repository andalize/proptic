#!/bin/bash

echo "Stopping and removing existing containers..."
docker compose -f docker-compose.dev.yml down -v --remove-orphans

echo "Starting development environment..."
docker compose -f docker-compose.dev.yml up --build
