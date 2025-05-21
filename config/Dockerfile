# Build stage for the frontend
FROM node:18-alpine as frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

COPY client/ .
RUN npm run build

# Build stage for the backend
FROM python:3.10-slim as backend-builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy Python dependencies from builder
COPY --from=backend-builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=backend-builder /usr/local/bin/ /usr/local/bin/

# Copy package files first for better layer caching
COPY package*.json ./

# Copy server files
COPY server/ ./server/

# Copy environment files if they exist
COPY .env* ./


# Copy built frontend files from frontend-builder
COPY --from=frontend-builder /app/client/dist ./client/dist

# Install production dependencies
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Create a directory for temporary files
RUN mkdir -p /app/data

# Set the working directory to the server directory
WORKDIR /app/server

# Run the application
CMD ["node", "index.js"]
