#!/usr/bin/env bash
set -e
docker compose up --build -d
echo "Prelegal is running at http://localhost:8000"
