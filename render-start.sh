#!/bin/bash
# Render start script for WebAudioTranscriber
# This script runs the application on Render.com

set -o errexit  # Exit on any error
set -o nounset  # Exit on undefined variables
set -o pipefail # Exit on pipe errors

echo "🚀 Starting WebAudioTranscriber..."

# Create necessary directories if they don't exist
mkdir -p uploads

# Set file permissions
chmod -R 777 uploads

# Run database migrations if needed
# echo "🔄 Running database migrations..."
# npx prisma migrate deploy

# Start the application
echo "🚀 Starting Node.js application..."
exec node server/index.js

echo "❌ Application failed to start"
exit 1
