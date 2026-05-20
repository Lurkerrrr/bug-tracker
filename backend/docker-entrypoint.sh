#!/bin/sh
# Container entrypoint for the NestJS backend.
# Runs build, optionally migrations, then starts the app.

set -e

echo "Building application..."
yarn build

if [ "$ENV" = "production" ]; then
    echo "Running migrations (ENV=production)..."
    yarn migration:run
else
    echo "Skipping migrations (ENV=${ENV:-unset}, dev uses synchronize)"
fi

echo "Starting application..."
exec node dist/main.js