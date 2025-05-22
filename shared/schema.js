import { z } from 'zod';

// Schema for audio URL request
export const audioUrlSchema = z.object({
  url: z.string().url(),
  options: z.object({
    language: z.string().optional(),
    prompt: z.string().optional(),
  }).optional(),
});

// Schema for transcription response
export const transcriptionResponseSchema = z.object({
  text: z.string(),
  audioDuration: z.number().optional(),
  wordCount: z.number().optional(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  utterances: z.array(
    z.object({
      speaker: z.string(),
      text: z.string(),
      start: z.number().optional(),
      end: z.number().optional(),
    })
  ).optional(),
  speaker_labels: z.boolean().optional(),
  speakers: z.array(z.string()).optional(),
});

// Define the schema for a transcription record
export const transcriptionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  audioUrl: z.string().nullable(),
  audioDuration: z.number().optional(),
  wordCount: z.number().optional(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  createdAt: z.date().optional(),
});

export default {
  audioUrlSchema,
  transcriptionResponseSchema,
  transcriptionSchema,
}; 