import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { transcribeFromUrl, transcribeFromFile } from './services/transcriptionService.js';

// Create Express application
const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const tempDir = path.join(path.dirname(__dirname), 'uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: NODE_ENV === 'production' 
    ? ['https://webaudio-transcriber.onrender.com'] 
    : ['http://localhost:3000'],
  credentials: true,
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.post("/api/transcribe/url", async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }
    
    const transcriptionResult = await transcribeFromUrl(url);
    
    if (transcriptionResult.error) {
      return res.status(400).json({ 
        message: `Transcription failed: ${transcriptionResult.error}` 
      });
    }
    
    return res.status(200).json({
      text: transcriptionResult.text,
      segments: transcriptionResult.segments || [],
      speakers: transcriptionResult.speakers || [],
      status: 'completed'
    });
  } catch (error) {
    console.error("Error in URL transcription:", error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to transcribe audio URL" 
    });
  }
});

// Transcribe from file upload
app.post("/api/transcribe/upload", upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No audio file provided" });
    }
    
    const transcriptionResult = await transcribeFromFile(req.file);
    
    // Clean up temp file after transcription
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });
    
    if (transcriptionResult.error) {
      return res.status(400).json({ 
        message: `Transcription failed: ${transcriptionResult.error}` 
      });
    }
    
    return res.status(200).json({
      text: transcriptionResult.text,
      segments: transcriptionResult.segments || [],
      speakers: transcriptionResult.speakers || [],
      status: 'completed'
    });
  } catch (error) {
    console.error("Error in file transcription:", error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : "Failed to transcribe audio file" 
    });
  }
});

// Serve static files in production
if (NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../dist/public');
  app.use(express.static(clientPath));
  
  // Handle SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} (${NODE_ENV})`);
}); 