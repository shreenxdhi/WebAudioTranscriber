#!/bin/bash
# Render build script for WebAudioTranscriber
# This script runs during the build phase on Render.com

set -o errexit  # Exit on any error
set -o nounset  # Exit on undefined variables
set -o pipefail # Exit on pipe errors

echo "🚀 Starting Render build process..."

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
python -m pip install --upgrade pip
pip install -r requirements.txt

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm ci --include=dev

# Build the client
echo "🔨 Building client..."
cd client
npm ci
npm run build
cd ..

# Create necessary directories
echo "📂 Creating directories..."
mkdir -p uploads

# Set file permissions
echo "🔒 Setting permissions..."
chmod -R 777 uploads

# Install Whisper model (small model for Render's free tier)
echo "🤖 Downloading Whisper model (base)..."
python -c "import whisper; whisper.load_model('base')"

echo "✅ Build completed successfully!"

exit 0
