import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { analyzeDream } from "./gemini";
import { insertUserSchema, loginSchema, dreamAnalysisSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

// Extend Express Request type to include session
declare module "express-session" {
  interface SessionData {
    userId?: number;
    sessionId?: string;
  }
}

interface AuthenticatedRequest extends Request {
  session: session.Session & Partial<session.SessionData> & {
    userId?: number;
    sessionId?: string;
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "dream-analyzer-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize session tracking
  app.use(async (req: AuthenticatedRequest, res, next) => {
    if (!req.session.sessionId) {
      req.session.sessionId = nanoid();
      // Create session in storage
      await storage.createSession({
        id: req.session.sessionId,
        userId: null,
        guestUsageCount: 0,
        userUsageCount: 0
      });
    }
    next();
  });

  // Auth routes
  app.post("/api/auth/register", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "المستخدم موجود بالفعل" });
      }

      const user = await storage.createUser(userData);
      req.session.userId = user.id;
      
      // Update session
      if (req.session.sessionId) {
        await storage.updateSession(req.session.sessionId, {
          userId: user.id,
          userUsageCount: 0
        });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "حدث خطأ في التسجيل" });
    }
  });

  app.post("/api/auth/login", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      const isPasswordValid = await storage.verifyPassword(loginData.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      }

      req.session.userId = user.id;
      
      // Update session
      if (req.session.sessionId) {
        await storage.updateSession(req.session.sessionId, {
          userId: user.id
        });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "حدث خطأ في تسجيل الدخول" });
    }
  });

  app.post("/api/auth/logout", async (req: AuthenticatedRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
      }
      res.json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  app.get("/api/auth/user", async (req: AuthenticatedRequest, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "غير مسجل الدخول" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        } 
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "خطأ في جلب بيانات المستخدم" });
    }
  });

  // Dream analysis routes
  app.post("/api/dreams/analyze", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dreamData = dreamAnalysisSchema.parse(req.body);
      
      // Get current session
      const session = req.session.sessionId ? await storage.getSession(req.session.sessionId) : null;
      if (!session) {
        return res.status(400).json({ message: "جلسة غير صالحة" });
      }

      // Check usage limits
      const isLoggedIn = !!req.session.userId;
      const currentUsage = isLoggedIn ? (session.userUsageCount ?? 0) : (session.guestUsageCount ?? 0);
      const maxUsage = isLoggedIn ? 10 : 1;

      if (currentUsage >= maxUsage) {
        if (!isLoggedIn) {
          return res.status(403).json({ 
            message: "يرجى التسجيل أو تسجيل الدخول لتحليل المزيد من الأحلام",
            requiresAuth: true 
          });
        } else {
          return res.status(403).json({ 
            message: "لقد وصلت إلى الحد الأقصى المسموح به من التحليلات" 
          });
        }
      }

      // Analyze dream with AI
      const analysis = await analyzeDream(dreamData.dreamText);

      // Save analysis
      const dreamAnalysis = await storage.createDreamAnalysis({
        userId: req.session.userId || null,
        dreamText: dreamData.dreamText,
        analysis
      });

      // Update usage count
      if (isLoggedIn) {
        await storage.updateSession(req.session.sessionId!, {
          userUsageCount: currentUsage + 1
        });
      } else {
        await storage.updateSession(req.session.sessionId!, {
          guestUsageCount: currentUsage + 1
        });
      }

      res.json({ 
        analysis: dreamAnalysis,
        remainingUsage: maxUsage - currentUsage - 1
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Dream analysis error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء تحليل الحلم" });
    }
  });

  app.get("/api/dreams/usage", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const session = req.session.sessionId ? await storage.getSession(req.session.sessionId) : null;
      if (!session) {
        return res.status(400).json({ message: "جلسة غير صالحة" });
      }

      const isLoggedIn = !!req.session.userId;
      const currentUsage = isLoggedIn ? (session.userUsageCount ?? 0) : (session.guestUsageCount ?? 0);
      const maxUsage = isLoggedIn ? 10 : 1;

      res.json({
        currentUsage,
        maxUsage,
        remainingUsage: maxUsage - currentUsage,
        isLoggedIn
      });
    } catch (error) {
      console.error("Usage check error:", error);
      res.status(500).json({ message: "خطأ في جلب بيانات الاستخدام" });
    }
  });

  app.get("/api/dreams/history", async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "يجب تسجيل الدخول لمشاهدة سجل الأحلام" });
      }

      const dreams = await storage.getDreamAnalysesByUser(req.session.userId);
      
      // ترتيب الأحلام من الأحدث إلى الأقدم
      const sortedDreams = dreams.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      res.json(sortedDreams);
    } catch (error) {
      console.error("Error getting dream history:", error);
      res.status(500).json({ message: "خطأ في الحصول على سجل الأحلام" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
