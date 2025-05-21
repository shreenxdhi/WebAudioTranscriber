const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

/**
 * @route GET /health
 * @description Health check endpoint
 * @returns {Object} 200 - Application status
 */
router.get('/', (req, res) => {
  const healthcheck = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    checks: [
      {
        name: 'Application',
        status: 'UP',
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Check if Python is available
  exec('python3 --version', (error, stdout, stderr) => {
    healthcheck.checks.push({
      name: 'Python',
      status: !error ? 'UP' : 'DOWN',
      version: !error ? stdout.trim() : 'Not available',
      timestamp: new Date().toISOString()
    });

    // Check if FFmpeg is available
    exec('ffmpeg -version', (ffmpegError, ffmpegStdout) => {
      healthcheck.checks.push({
        name: 'FFmpeg',
        status: !ffmpegError ? 'UP' : 'DOWN',
        version: !ffmpegError ? 
          ffmpegStdout.split('\n')[0].replace('ffmpeg version', '').trim() : 
          'Not available',
        timestamp: new Date().toISOString()
      });

      // Check if Whisper is available
      exec('python3 -c "import whisper; print(whisper.__version__)"', 
        (whisperError, whisperStdout) => {
          healthcheck.checks.push({
            name: 'Whisper',
            status: !whisperError ? 'UP' : 'DOWN',
            version: !whisperError ? whisperStdout.trim() : 'Not available',
            timestamp: new Date().toISOString()
          });

          // If any critical check failed, mark overall status as DOWN
          const criticalChecks = healthcheck.checks.filter(check => 
            ['Python', 'FFmpeg', 'Whisper'].includes(check.name)
          );
          
          if (criticalChecks.some(check => check.status === 'DOWN')) {
            healthcheck.status = 'DOWN';
          }

          res.status(200).json(healthcheck);
      });
    });
  });
});

module.exports = router;
