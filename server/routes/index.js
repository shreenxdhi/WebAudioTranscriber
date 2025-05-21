const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const router = express.Router();
const execAsync = promisify(exec);

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/*', 'video/*', 'application/octet-stream'];
    if (allowedTypes.some(type => file.mimetype.startsWith(type.split('/')[0]))) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  },
});

// Helper function to clean up temporary files
const cleanupFiles = async (filePaths) => {
  const unlinkAsync = promisify(fs.unlink);
  await Promise.all(
    filePaths.map(filePath => 
      unlinkAsync(filePath).catch(() => {})
    )
  );
};

/**
 * @route POST /api/transcribe/upload
 * @description Transcribe audio from an uploaded file
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const tempFilePath = req.file.path;
  const outputPath = `${tempFilePath}_transcribed.json`;
  
  try {
    // Call the Python script for transcription
    const { stdout, stderr } = await execAsync(
      `python3 ${path.join(__dirname, 'transcribe_audio.py')} "${tempFilePath}" "${outputPath}"`
    );

    if (stderr) {
      console.error('Transcription stderr:', stderr);
    }

    // Read the transcription result
    const result = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    
    // Clean up temporary files
    await cleanupFiles([tempFilePath, outputPath]);
    
    // Send the transcription result
    res.json(result);
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Clean up any remaining files
    await cleanupFiles([tempFilePath, outputPath].filter(fs.existsSync));
    
    res.status(500).json({
      error: 'Transcription failed',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

/**
 * @route POST /api/transcribe/url
 * @description Transcribe audio from a URL
 */
router.post('/url', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const tempDir = 'temp';
  const tempFilePath = path.join(tempDir, `temp_${Date.now()}`);
  const outputPath = `${tempFilePath}_transcribed.json`;

  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Call the Python script for URL transcription
    const { stdout, stderr } = await execAsync(
      `python3 ${path.join(__dirname, 'transcribe_audio.py')} --url "${url}" "${tempFilePath}" "${outputPath}"`
    );

    if (stderr) {
      console.error('Transcription stderr:', stderr);
    }

    // Read the transcription result
    const result = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    
    // Clean up temporary files
    await cleanupFiles([tempFilePath, outputPath]);
    
    // Send the transcription result
    res.json(result);
  } catch (error) {
    console.error('URL transcription error:', error);
    
    // Clean up any remaining files
    await cleanupFiles([tempFilePath, outputPath].filter(fs.existsSync));
    
    res.status(500).json({
      error: 'URL transcription failed',
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

module.exports = router;
