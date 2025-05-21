import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";
import { AssemblyAI } from "assemblyai";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure AssemblyAI
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    console.error("AssemblyAI API key not found. Please set the ASSEMBLYAI_API_KEY environment variable.");
  }
  
  const client = new AssemblyAI({
    apiKey: apiKey || ""
  });

  // Health check endpoint for deployment monitoring
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "healthy" });
  });

  // Simple test endpoint
  app.get("/api/test", (req: Request, res: Response) => {
    res.json({ message: "API is working!" });
  });

  // Transcribe from URL
  app.post("/api/transcribe/url", async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      console.log("Starting transcription from URL:", url);
      
      const transcript = await client.transcripts.transcribe({
        audio: url
      });
      
      console.log("Transcription result:", transcript.status);
      
      if (transcript.status === "error") {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcript.error || "Unknown error"}` 
        });
      }
      
      return res.status(200).json({
        text: transcript.text,
        audioDuration: transcript.audio_duration || 0,
        wordCount: transcript.text ? transcript.text.split(/\s+/).filter(Boolean).length : 0,
        status: transcript.status
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
      console.log("Starting transcription from file:", req.file.originalname);
      
      // Read file as Buffer
      const fileBuffer = fs.readFileSync(filePath);
      
      // Transcribe with AssemblyAI
      const transcript = await client.transcripts.transcribe({
        audio: fileBuffer
      });
      
      // Clean up temp file after transcription
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
      
      console.log("Transcription result:", transcript.status);
      
      if (transcript.status === "error") {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcript.error || "Unknown error"}` 
        });
      }
      
      return res.status(200).json({
        text: transcript.text,
        audioDuration: transcript.audio_duration || 0,
        wordCount: transcript.text ? transcript.text.split(/\s+/).filter(Boolean).length : 0,
        status: transcript.status
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