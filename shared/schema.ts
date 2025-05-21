import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  audioUrl: text("audio_url"),
  audioDuration: integer("audio_duration"),
  wordCount: integer("word_count"),
  status: text("status").notNull().default("completed"),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTranscriptionSchema = createInsertSchema(transcriptions).pick({
  text: true,
  audioUrl: true,
  audioDuration: true,
  wordCount: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTranscription = z.infer<typeof insertTranscriptionSchema>;
export type Transcription = typeof transcriptions.$inferSelect;

// API Schemas

export const audioUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  options: z.object({
    speechModel: z.enum(["base", "best"]).default("best")
  }).optional()
});

export type AudioUrlRequest = z.infer<typeof audioUrlSchema>;

export const transcriptionResponseSchema = z.object({
  text: z.string(),
  audioDuration: z.number().optional(),
  wordCount: z.number().optional(),
  status: z.string()
});

export type TranscriptionResponse = z.infer<typeof transcriptionResponseSchema>;
