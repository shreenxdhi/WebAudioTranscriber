import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { z } from "zod";
import { audioUrlSchema, transcriptionResponseSchema } from "@shared/schema";
import assemblyai from "assemblyai";
import path from "path";
import fs from "fs";
import os from "os";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const tempDir = path.join(os.tmpdir(), 'audio-uploads');
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure AssemblyAI
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  const client = new assemblyai.AssemblyAI({
    apiKey: apiKey
  });

  // Transcribe from URL
  app.post("/api/transcribe/url", async (req: Request, res: Response) => {
    try {
      const validatedData = audioUrlSchema.parse(req.body);
      const { url, options } = validatedData;
      
      const transcript = await client.transcripts.transcribe({
        audio: url,
        model: options?.speechModel === "base" ? "base" : "best"
      });
      
      if (!transcript || !transcript.text) {
        return res.status(400).json({ 
          message: "Transcription failed: No transcript was generated" 
        });
      }
      
      // Prepare response
      const words = transcript.text.split(/\s+/).filter(Boolean);
      const response = {
        text: transcript.text,
        audioDuration: transcript.audio_duration,
        wordCount: words.length,
        status: "completed"
      };
      
      // Validate response
      const validatedResponse = transcriptionResponseSchema.parse(response);
      
      // Save transcription to storage
      await storage.saveTranscription({
        text: transcript.text,
        audioUrl: url,
        audioDuration: transcript.audio_duration || 0,
        wordCount: words.length,
        status: "completed"
      });
      
      return res.status(200).json(validatedResponse);
    } catch (error) {
      console.error("Error in URL transcription:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to transcribe audio URL" 
      });
    }
  });

  // Transcribe from file upload
  app.post("/api/transcribe/upload", upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }
      
      const speechModel = req.body.speechModel === "base" ? "base" : "best";
      const filePath = req.file.path;
      
      // Read file as Buffer
      const fileBuffer = fs.readFileSync(filePath);
      
      // Create transcriber and config
      const transcriber = new assemblyai.Transcriber();
      const transcript = await transcriber.transcribe({
        audio: fileBuffer,
        speech_model: speechModel
      });
      
      // Clean up temp file after transcription
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temporary file:", err);
      });
      
      if (transcript.status === "error") {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcript.error}` 
        });
      }
      
      // Prepare response
      const words = transcript.text.split(/\s+/).filter(Boolean);
      const response = {
        text: transcript.text,
        audioDuration: transcript.audio_duration,
        wordCount: words.length,
        status: "completed"
      };
      
      // Validate response
      const validatedResponse = transcriptionResponseSchema.parse(response);
      
      // Save transcription to storage
      await storage.saveTranscription({
        text: transcript.text,
        audioUrl: null,
        audioDuration: transcript.audio_duration || 0,
        wordCount: words.length,
        status: "completed"
      });
      
      return res.status(200).json(validatedResponse);
    } catch (error) {
      console.error("Error in file transcription:", error);
      
      return res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to transcribe audio file" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
