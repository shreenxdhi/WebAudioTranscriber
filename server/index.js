const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');
const healthRouter = require('./health');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.use('/health', healthRouter);

// API routes
app.use('/api/transcribe', require('./routes'));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Log environment information
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Node version:', process.version);
  
  // Log Python and FFmpeg versions
  exec('python3 --version', (pyErr, pyStdout, pyStderr) => {
    if (!pyErr) {
      console.log('Python version:', pyStdout.trim());
    } else {
      console.error('Python not found or error:', pyStderr || pyErr);
    }
    
    exec('ffmpeg -version', (ffmpegErr, ffmpegStdout) => {
      if (!ffmpegErr) {
        const versionLine = ffmpegStdout.split('\n')[0];
        console.log('FFmpeg version:', versionLine.replace('ffmpeg version', '').trim());
      } else {
        console.error('FFmpeg not found or error:', ffmpegErr);
      }
    });
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = server;
