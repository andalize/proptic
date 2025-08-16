#!/bin/bash

if [[ $1 == "--yarn" ]]; then
    shift
    # Check if -D flag is present
    if [[ "$1" == "-D" ]]; then
        shift
        docker compose -f ../docker-compose.dev.yml exec client yarn add -D "$@"
    else
        docker compose -f ../docker-compose.dev.yml exec client yarn add "$@"
    fi
elif [[ $1 == "--shadcn" ]]; then
    shift
    docker compose -f ../docker-compose.dev.yml exec client npx shadcn@latest add "$@"
else
    echo "Usage:"
    echo "  $0 --yarn [-D] <package-name>"
    echo "  $0 --shadcn <package-name>"
    exit 1
fi
