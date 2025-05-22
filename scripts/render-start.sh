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

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}

# Make Python script executable
chmod +x server/transcribe_audio.py

# Start the application
echo "🚀 Starting Node.js application..."
exec npm run start

echo "❌ Application failed to start"
exit 1
