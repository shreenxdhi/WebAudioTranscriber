import { users, transcriptions, type User, type InsertUser, type Transcription, type InsertTranscription } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveTranscription(transcription: InsertTranscription): Promise<Transcription>;
  getTranscription(id: number): Promise<Transcription | undefined>;
  getRecentTranscriptions(limit?: number): Promise<Transcription[]>;
}

// In-memory storage implementation (used as a fallback or for testing)
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
  
  async getRecentTranscriptions(limit: number = 10): Promise<Transcription[]> {
    // Get all transcriptions, sort by id (descending), and take the most recent ones
    return Array.from(this.transcriptions.values())
      .sort((a, b) => b.id - a.id)
      .slice(0, limit);
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async saveTranscription(insertTranscription: InsertTranscription): Promise<Transcription> {
    // Set default values for optional fields
    const dataToInsert = {
      text: insertTranscription.text,
      audioUrl: insertTranscription.audioUrl || null,
      audioDuration: insertTranscription.audioDuration || 0,
      wordCount: insertTranscription.wordCount || 0,
      status: insertTranscription.status || "completed",
      createdAt: new Date().toISOString()
    };
    
    const [transcription] = await db.insert(transcriptions).values(dataToInsert).returning();
    return transcription;
  }

  async getTranscription(id: number): Promise<Transcription | undefined> {
    const [transcription] = await db.select().from(transcriptions).where(eq(transcriptions.id, id));
    return transcription;
  }
  
  async getRecentTranscriptions(limit: number = 10): Promise<Transcription[]> {
    return await db.select()
      .from(transcriptions)
      .orderBy(transcriptions.id)
      .limit(limit);
  }
}

// Export the DatabaseStorage instance to use throughout the application
export const storage = new DatabaseStorage();
