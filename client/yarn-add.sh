#!/bin/bash

if [[ $1 == "--yarn" ]]; then
    shift
    docker compose -f ../docker-compose.dev.yml exec client yarn add "$@"
elif [[ $1 == "--shadcn" ]]; then
    shift
    docker compose -f ../docker-compose.dev.yml exec client npx shadcn@latest add "$@"
else
    echo "Usage:"
    echo "  $0 --yarn <package-name>"
    echo "  $0 --shadcn <package-name>"
    exit 1
fi