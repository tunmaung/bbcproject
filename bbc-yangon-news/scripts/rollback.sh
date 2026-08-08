#!/bin/bash

set -e

PROJECT_DIR="/home/ubuntu/bbcproject/bbc-yangon-news"
BACKUP_DIR="$PROJECT_DIR/backups"
APP_NAME="bbc-yangon-news"

echo "======================================"
echo " BBC Yangon News - Rollback"
echo "======================================"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "ERROR: Backup directory not found."
    exit 1
fi

LATEST_BACKUP=$(find "$BACKUP_DIR" -maxdepth 1 -type f -name 'dist-*.tar.gz' -printf '%T@ %p\n' \
    | sort -nr \
    | head -1 \
    | cut -d' ' -f2-)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ERROR: No deployment backup found."
    exit 1
fi

echo "Latest backup:"
echo "$LATEST_BACKUP"

echo "Removing current dist..."
rm -rf "$PROJECT_DIR/dist"

echo "Restoring backup..."
tar -xzf "$LATEST_BACKUP" -C "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/dist/index.js" ]; then
    echo "ERROR: Rollback verification failed."
    exit 1
fi

echo "Reloading PM2..."
pm2 reload "$APP_NAME" --update-env

echo "Checking PM2..."
pm2 status "$APP_NAME"

echo "======================================"
echo " Rollback Successful"
echo "======================================"
