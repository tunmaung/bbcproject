#!/bin/bash

set -e

PROJECT_DIR="/home/ubuntu/bbcproject/bbc-yangon-news"
BACKUP_DIR="$PROJECT_DIR/backups"
APP_NAME="bbc-yangon-news"

echo "=================================="
echo " BBC Yangon News Deployment"
echo "=================================="

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

echo "Creating backup..."

if [ -d "$PROJECT_DIR/dist" ]; then
    tar -czf "$BACKUP_DIR/dist-$TIMESTAMP.tar.gz" \
        -C "$PROJECT_DIR" dist
fi

echo "Updating source..."

git config --global --add safe.directory /home/ubuntu/bbcproject

cd "$PROJECT_DIR"

git fetch origin
git reset --hard origin/main

echo "Installing dependencies..."

pnpm install --frozen-lockfile

echo "Building..."

pnpm run build

echo "Reloading PM2..."

pm2 reload "$APP_NAME" --update-env

echo "Deployment completed successfully."
