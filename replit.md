# Voice Transcription Application with AssemblyAI

## Overview

This application is a voice transcription service that allows users to convert speech to text using AssemblyAI's API. The application supports both file uploads and URL-based audio transcription. It features a React-based frontend with a modern UI (using shadcn/ui components) and an Express.js backend that handles API requests and serves the frontend application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a client-server architecture with a clear separation between frontend and backend:

1. **Frontend**: React-based single-page application with Tailwind CSS for styling
2. **Backend**: Express.js server handling API requests and serving the frontend
3. **Database**: PostgreSQL with Drizzle ORM for data persistence
4. **External Services**: AssemblyAI API for speech-to-text transcription

The application is configured to run in a Replit environment with support for Node.js and PostgreSQL.

## Key Components

### Frontend

- **React**: Main UI framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI / shadcn/ui**: Component library for accessible UI elements
- **React Query**: Data fetching and state management
- **wouter**: Lightweight router for page navigation

The frontend is organized into pages and components. The main page (`Home.tsx`) contains the transcription form and results display.

### Backend

- **Express.js**: Web server framework handling HTTP requests
- **Multer**: Middleware for file uploads
- **Drizzle ORM**: Type-safe database query builder
- **AssemblyAI SDK**: Client for transcription service
- **zod**: Schema validation for API requests and responses

The backend provides API endpoints for transcription services and handles authentication (though the auth implementation may not be complete in the current codebase).

### Database

- **PostgreSQL**: The application uses a PostgreSQL database
- **Schema**:
  - `users`: Store user information
  - `transcriptions`: Store transcription records

### API Structure

The main API endpoints include:

- **POST /api/transcribe/url**: Transcribe audio from a URL
- File upload endpoint (implementation not complete in the codebase sample)

## Data Flow

1. **User Input**:
   - Users can either upload an audio file or provide a URL to an audio file
   - Advanced options allow selecting different speech models

2. **Transcription Process**:
   - Frontend sends the audio file or URL to the backend
   - Backend validates the input and forwards it to AssemblyAI
   - AssemblyAI processes the audio and returns the transcription
   - Backend stores the transcription in the database and returns it to the frontend

3. **Result Display**:
   - Frontend displays the transcription text
   - Users can copy the text to clipboard or start a new transcription

## External Dependencies

1. **AssemblyAI**: Speech-to-text API service
2. **PostgreSQL**: Database service (via Neon serverless Postgres)
3. **UI Components**: The application uses many Radix UI components through shadcn/ui

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development**: `npm run dev` starts both frontend and backend in development mode
2. **Build**: `npm run build` compiles both frontend and backend for production
3. **Production**: `npm run start` runs the production build

The `.replit` file defines the deployment configuration, including:
- Port mapping (5000 -> 80)
- Build and run commands
- Module configuration for Node.js and PostgreSQL

## Database Migration

The application uses Drizzle ORM for database schema management. The schema is defined in `shared/schema.ts`, and migrations can be applied using `npm run db:push`.

## Project Structure

- `/server`: Backend code
- `/client/src`: Frontend source code
- `/shared`: Shared code (like database schema) between frontend and backend
- `/attached_assets`: Support files for the application

## Development Notes

1. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `ASSEMBLYAI_API_KEY`: API key for AssemblyAI service

2. **Getting Started**:
   - Install dependencies: `npm install`
   - Start the development server: `npm run dev`
   - Database setup: `npm run db:push`

3. **Common Issues**:
   - Ensure AssemblyAI API key is configured
   - PostgreSQL needs to be provisioned in the Replit environment