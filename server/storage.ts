import { users, type User, type InsertUser, type Transcription, type InsertTranscription } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveTranscription(transcription: InsertTranscription): Promise<Transcription>;
  getTranscription(id: number): Promise<Transcription | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transcriptions: Map<number, Transcription>;
  currentUserId: number;
  currentTranscriptionId: number;

  constructor() {
    this.users = new Map();
    this.transcriptions = new Map();
    this.currentUserId = 1;
    this.currentTranscriptionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveTranscription(insertTranscription: InsertTranscription): Promise<Transcription> {
    const id = this.currentTranscriptionId++;
    const now = new Date().toISOString();
    
    // Ensure all required fields are present with default values if not provided
    const transcription: Transcription = { 
      id,
      text: insertTranscription.text,
      audioUrl: insertTranscription.audioUrl || null,
      audioDuration: insertTranscription.audioDuration || 0,
      wordCount: insertTranscription.wordCount || 0,
      status: insertTranscription.status || "completed",
      createdAt: now
    };
    
    this.transcriptions.set(id, transcription);
    return transcription;
  }

  async getTranscription(id: number): Promise<Transcription | undefined> {
    return this.transcriptions.get(id);
  }
}

export const storage = new MemStorage();
