import { User, InsertUser, Transcription, InsertTranscription } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveTranscription(transcription: InsertTranscription): Promise<Transcription>;
  getTranscription(id: number): Promise<Transcription | undefined>;
  getRecentTranscriptions(limit?: number): Promise<Transcription[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transcriptions: Map<number, Transcription>;
  currentUserId: number;
  currentTranscriptionId: number;

  constructor();
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  saveTranscription(insertTranscription: InsertTranscription): Promise<Transcription>;
  getTranscription(id: number): Promise<Transcription | undefined>;
  getRecentTranscriptions(limit?: number): Promise<Transcription[]>;
}

export class DatabaseStorage implements IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  saveTranscription(insertTranscription: InsertTranscription): Promise<Transcription>;
  getTranscription(id: number): Promise<Transcription | undefined>;
  getRecentTranscriptions(limit?: number): Promise<Transcription[]>;
}

export const storage: DatabaseStorage;
