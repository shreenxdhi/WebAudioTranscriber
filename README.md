# WebAudioTranscriber

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-blue)](https://www.typescriptlang.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A web application for transcribing audio files with speaker diarization capabilities.

## Features

- Upload audio files or provide URLs for transcription
- Record audio directly within the browser
- Automatic speaker diarization (identifies different speakers in the audio)
- Download transcriptions in various formats
- Clean, modern UI with dark/light mode support

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Node.js, Express
- **Speech Recognition**: Whisper (OpenAI)
- **Speaker Diarization**: pyannote.audio
- **Database**: SQLite (local development), PostgreSQL (production)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- FFmpeg

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/shreenxdhi/WebAudioTranscriber.git
   cd WebAudioTranscriber
   ```

2. Install dependencies
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. Create a `.env` file with your configuration
   ```
   # Required for speaker diarization
   HF_TOKEN=your_huggingface_token
   
   # Optional: Set the Whisper model (tiny, base, small, medium, large)
   WHISPER_MODEL=base
   
   # Application settings
   NODE_ENV=development
   PORT=3000
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

## Deployment

This project is configured for easy deployment to Render.com:

1. Create a new Web Service on Render
2. Link your GitHub repository
3. Set the required environment variables
4. Choose the `render-deploy` branch for deployment

For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI Whisper for speech recognition
- pyannote.audio for speaker diarization
- FFmpeg for audio processing

## ✨ Features

- 🎤 **Multiple Input Methods**: Upload audio files, record directly, or provide a URL
- 🗣️ **Speaker Diarization**: Identify different speakers in the audio
- 📱 **Responsive Design**: Works on both desktop and mobile devices
- 🎨 **Modern UI**: Built with React, TypeScript, and TailwindCSS
- ⚡ **Fast Processing**: Local processing for quick transcriptions
- 🐳 **Docker Support**: Easy setup with Docker and Docker Compose

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher) or [Yarn](https://yarnpkg.com/)
- [Python](https://www.python.org/) (3.8+)
- [FFmpeg](https://ffmpeg.org/) (for audio processing)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shreenxdhi/WebAudioTranscriber.git
   cd WebAudioTranscriber
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   # Start both client and server in development mode
   npm run dev:all
   ```

   Or using Docker:
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🏗️ Project Structure

```
WebAudioTranscriber/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── assets/         # Images, fonts, etc.
│       ├── components/     # Reusable UI components
│       ├── hooks/          # Custom React hooks
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── styles/         # Global styles
│       └── utils/          # Utility functions
│
├── server/                # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
│
├── shared/               # Shared code between frontend and backend
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Shared utility functions
│
├── config/               # Configuration files
│   ├── docker/            # Docker configuration
│   └── nginx/             # Nginx configuration
│
├── scripts/              # Build and utility scripts
├── tests/                 # Test files
└── docs/                  # Documentation
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run dev:server` - Start the backend development server
- `npm run dev:all` - Start both frontend and backend in development mode
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Application
NODE_ENV=development
PORT=3000
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/webaudio_transcriber

# Audio Processing
MAX_FILE_SIZE=52428800  # 50MB
UPLOAD_DIR=./uploads

# Security
SESSION_SECRET=your-session-secret
CORS_ORIGIN=http://localhost:5173
```

## 🐳 Docker

### Development

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI Whisper](https://openai.com/research/whisper) - Speech recognition model
- [pyannote.audio](https://github.com/pyannote/pyannote-audio) - Speaker diarization
- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Express](https://expressjs.com/) - Backend framework

## Deployment

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the "Deploy to Render" button above
2. Follow the prompts to connect your GitHub/GitLab/Bitbucket repository
3. Configure your environment variables (see [Environment Variables](#environment-variables))
4. Click "Create Web Service"
5. Wait for the deployment to complete

For detailed deployment instructions, see [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md).

## Local Development

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (recommended)
- Or, for manual installation:
  - Node.js (v18 or higher)
  - Python 3.8+
  - FFmpeg
  - npm or yarn

### Setup and Installation

### Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (for Docker installation)
- Or, for manual installation:
  - Node.js (v16 or higher)
  - Python 3.8+
  - FFmpeg
  - npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/shreenidhivasishta/WebAudioTranscriber.git
cd WebAudioTranscriber
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Set up Python environment

```bash
# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### 4. Install FFmpeg

#### macOS (using Homebrew):
```bash
brew install ffmpeg
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows (using Chocolatey):
```cmd
choco install ffmpeg
```

### 5. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
# Optional: Hugging Face token for speaker diarization
# Get one at: https://huggingface.co/settings/tokens
HF_TOKEN=your_huggingface_token

# Optional: Set the Whisper model (tiny, base, small, medium, large)
WHISPER_MODEL=base

# Optional: Set the device (cuda, cpu)
# Use 'cuda' if you have an NVIDIA GPU with CUDA support
DEVICE=cpu
```

### 6. Start the development server

#### Option 1: Using Docker (Recommended)

```bash
# Build and start the application
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Option 2: Manual Setup

```bash
# In one terminal, start the backend
npm run dev

# In another terminal, start the frontend (from the client directory)
cd client
npm run dev
```

Visit `http://localhost:3000` in your browser to use the application.

### 7. Check Environment (Optional)

Run the environment check script to verify all dependencies are properly installed:

```bash
python3 check_environment.py
```

This will check for all required dependencies and their versions.

## Usage

1. Choose an input method:
   - **Upload**: Select an audio file from your device
   - **Record**: Record audio directly from your microphone
   - **URL**: Provide a URL to an audio file

2. Click "Transcribe Audio" to start the transcription process

3. View the transcription results, which will include:
   - The full transcription text
   - Speaker identification (if diarization is available)
   - Timestamps for each segment

4. Use the download button to save the transcription in your preferred format

## Deployment

### Production Deployment

For production deployment, it's recommended to use Docker with a reverse proxy like Nginx and HTTPS. Here's a basic setup:

1. Set up a server with Docker and Docker Compose
2. Clone the repository
3. Create a `.env` file with your production settings
4. Build and start the containers:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Environment Variables

For production, make sure to set these environment variables:

- `NODE_ENV=production`
- `PORT=3000` (or your preferred port)
- `WHISPER_MODEL=base` (or your preferred model)
- `HF_TOKEN=your_huggingface_token` (for speaker diarization)
- `DEVICE=cpu` (or `cuda` if you have GPU support)

## Troubleshooting

### Common Issues

1. **Missing Python packages**:
   ```bash
   pip install -r requirements.txt
   ```

2. **FFmpeg not found**:
   Make sure FFmpeg is installed and available in your system PATH.

3. **CUDA errors**:
   If you have an NVIDIA GPU, install PyTorch with CUDA support:
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

4. **Large file size**:
   The application has a 50MB file size limit. For larger files, consider compressing the audio or using a service that supports larger files.

5. **Docker build issues**:
   - If you encounter permission issues with Docker, make sure your user is in the `docker` group
   - If you're using GPU, make sure to install NVIDIA Container Toolkit
   - Increase Docker's memory allocation if the build fails due to insufficient memory

6. **Python package installation issues**:
   - Make sure you have the latest version of pip: `pip install --upgrade pip`
   - On some systems, you might need to install Python development headers: `sudo apt-get install python3-dev`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI Whisper](https://github.com/openai/whisper)
- [pyannote.audio](https://github.com/pyannote/pyannote-audio)
- [FFmpeg](https://ffmpeg.org/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Access the application at `http://localhost:5000`

## Building for Production

1. Build the application:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Deployment to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: WebAudioTranscriber (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`