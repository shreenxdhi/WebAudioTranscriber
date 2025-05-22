import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "../services/storage.js";
import multer from "multer";
import { z } from "zod";
import { audioUrlSchema, transcriptionResponseSchema } from "../../shared/schema.js";
import path from "path";
import fs from "fs";
import os from "os";
import { transcribeFromUrl, transcribeFromFile, formatTranscriptionResult } from "../services/transcriptionService.js";

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
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Accept only audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Log startup info
  console.log("Starting transcription service with custom implementation");
  // No external API key needed for our custom implementation

  // Transcribe from URL
  app.post("/api/transcribe/url", async (req: Request, res: Response) => {
    try {
      const validatedData = audioUrlSchema.parse(req.body);
      const { url, options } = validatedData;
      
      // Use our custom transcription service
      const transcriptionResult = await transcribeFromUrl(url);
      
      if (transcriptionResult.error) {
        return res.status(400).json({ 
          message: `Transcription failed: ${transcriptionResult.error}` 
        });
      }
      
      if (!transcriptionResult.text) {
        return res.status(400).json({ 
          message: "Transcription failed: No transcript was generated" 
        });
      }
      
      // Format the response
      const formattedResult = formatTranscriptionResult(transcriptionResult);
      
      // Calculate word count if not provided
      const wordCount = transcriptionResult.text.split(/\s+/).filter(Boolean).length;
      
      // Prepare response with speaker information
      const response = {
        text: transcriptionResult.text,
        audioDuration: 30, // Default duration since our custom service doesn't track this
        wordCount: wordCount,
        status: "completed",
        // Include speaker information if available
        utterances: formattedResult.utterances || [],
        speaker_labels: formattedResult.speaker_labels || false,
        speakers: formattedResult.speakers || []
      };
      
      // Validate response
      const validatedResponse = transcriptionResponseSchema.parse(response);
      
      // Save transcription to storage
      await storage.saveTranscription({
        text: transcriptionResult.text,
        audioUrl: url,
        audioDuration: 30, // Default duration
        wordCount: wordCount,
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
  app.post("/api/transcribe/upload", upload.single('file'), async (req: any, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No audio file provided" });
      }
      
      const speechModel = req.body.speechModel === "base" ? "base" : "best";
      
      // Use our custom transcription service
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
      
      if (!transcriptionResult.text) {
        return res.status(400).json({ 
          message: "Transcription failed: No transcript was generated" 
        });
      }
      
      // Format the response with speaker diarization
      const formattedResult = formatTranscriptionResult(transcriptionResult);
      
      // Calculate word count if not provided
      const wordCount = transcriptionResult.text.split(/\s+/).filter(Boolean).length;
      
      // Prepare response with speaker information
      const response = {
        text: transcriptionResult.text,
        audioDuration: 30, // Default duration since our custom service doesn't track this
        wordCount: wordCount,
        status: "completed",
        // Include speaker information if available
        utterances: formattedResult.utterances || [],
        speaker_labels: formattedResult.speaker_labels || false,
        speakers: formattedResult.speakers || []
      };
      
      // Validate response
      const validatedResponse = transcriptionResponseSchema.parse(response);
      
      // Save transcription to storage
      await storage.saveTranscription({
        text: transcriptionResult.text,
        audioUrl: null,
        audioDuration: 30, // Default duration
        wordCount: wordCount,
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
