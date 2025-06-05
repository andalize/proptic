#!/bin/bash
docker compose -f ../docker-compose.dev.yml exec client yarn remove "$@"
