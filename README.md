# WebAudioTranscriber

A web application for transcribing audio files using OpenAI's Whisper and pyannote.audio for speaker diarization. This application allows users to upload audio files, record audio directly, or provide a URL to an audio file, and get transcriptions with speaker identification.

## Features

- **Multiple Input Methods**: Upload audio files, record directly, or provide a URL
- **Speaker Diarization**: Identify different speakers in the audio
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern UI**: Built with React, TypeScript, and TailwindCSS
- **Fast Processing**: Local processing for quick transcriptions

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Transcription**: OpenAI Whisper, pyannote.audio
- **Audio Processing**: FFmpeg, pydub

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.8+ (for the transcription script)
- FFmpeg (for audio processing)

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
   - **Start Command**: `npm start`
   - **Plan**: Choose appropriate plan (Free tier works for testing)

4. Add the following environment variables in Render:
   - `DATABASE_URL` (Your NeonDB connection string)
   - `SESSION_SECRET` (A secure random string)
   - `NODE_ENV` = production

5. Deploy your application

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## About the Author

Developed by **Shreenidhi Vasishta**.

## Acknowledgements

- [Shadcn/UI](https://ui.shadcn.com/) for UI components
- [TailwindCSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework 