import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { execSync } from "child_process";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      const tempDir = path.join(os.tmpdir(), 'audio-uploads');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      cb(null, tempDir);
    },
    filename: (req: any, file: any, cb: any) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

/**
 * Local transcription processing 
 * Developed by Shreenidhi Vasishta
 */
async function processAudioLocally(audioPath: string): Promise<{ text: string; error?: string }> {
  try {
    // Use a local script or command-line tool to process the audio
    // This is a placeholder - replace with your actual local processing command
    const result = execSync(`python3 ./server/transcribe_audio.py "${audioPath}"`).toString();
    return { text: result.trim() };
  } catch (error: any) {
    console.error("Local transcription error:", error);
    return { text: "", error: error.message || "Failed to transcribe audio locally" };
  }
}

/**
 * Process audio from URL by downloading first
 * Developed by Shreenidhi Vasishta
 */
async function processUrlLocally(url: string): Promise<{ text: string; error?: string }> {
  try {
    const tempFile = path.join(os.tmpdir(), `download-${Date.now()}.mp3`);
    
    // Download the file (this is a placeholder - implement proper download logic)
    execSync(`curl -L "${url}" -o "${tempFile}"`);
    
    // Process the downloaded file
    const result = await processAudioLocally(tempFile);
    
    // Clean up
    fs.unlinkSync(tempFile);
    
    return result;
  } catch (error: any) {
    console.error("URL processing error:", error);
    return { text: "", error: error.message || "Failed to process audio URL locally" };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("Starting Shreenidhi Vasishta's local transcription service");

  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "healthy", author: "Shreenidhi Vasishta" });
  });

  // Simple test endpoint
  app.get("/api/test", (req: Request, res: Response) => {
    res.json({ message: "API is working!", author: "Shreenidhi Vasishta" });
  });

  // Transcribe from URL
  app.post("/api/transcribe/url", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      console.log("Starting local transcription from URL:", url);
      
      const transcriptionResult = await processUrlLocally(url);
      
      if (transcriptionResult.error) {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcriptionResult.error}` 
        });
      }
      
      const words = transcriptionResult.text.split(/\s+/).filter(Boolean);
      
      return res.status(200).json({
        text: transcriptionResult.text,
        audioDuration: 0, // We don't track this in local processing
        wordCount: words.length,
        status: "completed",
        processedBy: "Shreenidhi Vasishta's Local Transcription Service"
      });
      
    } catch (error: any) {
      console.error("Error in URL transcription:", error);
      return res.status(500).json({ 
        message: error.message || "Failed to transcribe audio URL" 
      });
    }
  });

  // Transcribe from file upload
  app.post("/api/transcribe/upload", upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }
      
      const filePath = req.file.path;
      console.log("Starting local transcription from file:", req.file.originalname);
      
      // Process with local transcription
      const transcriptionResult = await processAudioLocally(filePath);
      
      // Clean up temp file after transcription
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
      
      if (transcriptionResult.error) {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcriptionResult.error}` 
        });
      }
      
      const words = transcriptionResult.text.split(/\s+/).filter(Boolean);
      
      return res.status(200).json({
        text: transcriptionResult.text,
        audioDuration: 0, // We don't track this in local processing
        wordCount: words.length,
        status: "completed",
        processedBy: "Shreenidhi Vasishta's Local Transcription Service"
      });
      
    } catch (error: any) {
      console.error("Error in file transcription:", error);
      return res.status(500).json({ 
        message: error.message || "Failed to transcribe audio file" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}