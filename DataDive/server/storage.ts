import { users, dreamAnalyses, sessions, type User, type InsertUser, type DreamAnalysis, type InsertDreamAnalysis, type Session, type InsertSession } from "@shared/schema";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  
  // Dream analysis operations
  createDreamAnalysis(analysis: InsertDreamAnalysis): Promise<DreamAnalysis>;
  getDreamAnalysesByUser(userId: number): Promise<DreamAnalysis[]>;
  
  // Session operations
  getSession(sessionId: string): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private dreamAnalyses: Map<number, DreamAnalysis>;
  private sessions: Map<string, Session>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.dreamAnalyses = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async createDreamAnalysis(analysisData: InsertDreamAnalysis): Promise<DreamAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: DreamAnalysis = {
      id,
      userId: analysisData.userId ?? null,
      dreamText: analysisData.dreamText,
      analysis: analysisData.analysis,
      createdAt: new Date()
    };
    this.dreamAnalyses.set(id, analysis);
    return analysis;
  }

  async getDreamAnalysesByUser(userId: number): Promise<DreamAnalysis[]> {
    return Array.from(this.dreamAnalyses.values()).filter(
      (analysis) => analysis.userId === userId,
    );
  }

  async getSession(sessionId: string): Promise<Session | undefined> {
    return this.sessions.get(sessionId);
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const session: Session = {
      id: sessionData.id,
      userId: sessionData.userId ?? null,
      guestUsageCount: sessionData.guestUsageCount ?? 0,
      userUsageCount: sessionData.userUsageCount ?? 0,
      createdAt: new Date()
    };
    this.sessions.set(sessionData.id, session);
    return session;
  }

  async updateSession(sessionId: string, updates: Partial<Session>): Promise<Session | undefined> {
    const session = this.sessions.get(sessionId);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
