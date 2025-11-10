import bcrypt from "bcryptjs";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateUserId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const isAuthenticatedLocal: RequestHandler = async (req: any, res, next) => {
  if (req.session?.userId) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        req.user = { 
          claims: { 
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl
          }
        };
        return next();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  res.status(401).json({ message: "Unauthorized" });
};

export const isAuthenticatedAny: RequestHandler = async (req: any, res, next) => {
  // Check if user is authenticated via Replit Auth (OAuth)
  if (req.user?.claims?.sub) {
    return next();
  }
  
  // Check if user is authenticated via local session
  if (req.session?.userId) {
    try {
      const user = await storage.getUser(req.session.userId);
      if (user) {
        // Ensure req.user structure matches OAuth format
        req.user = { 
          claims: { 
            sub: user.id,
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            profile_image_url: user.profileImageUrl
          }
        };
        return next();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  
  res.status(401).json({ message: "Unauthorized" });
};

export const isApprovedStudent: RequestHandler = async (req: any, res, next) => {
  try {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.claims.sub;
    const student = await storage.getStudentByUserId(userId);

    if (!student) {
      return res.status(404).json({ message: "Perfil de estudante não encontrado. Por favor, complete seu registro." });
    }

    if (student.approvalStatus === 'rejected') {
      return res.status(403).json({ message: "Sua conta foi rejeitada. Contacte o administrador para mais informações." });
    }

    if (student.approvalStatus === 'pending') {
      return res.status(403).json({ message: "Sua conta está pendente de aprovação. Aguarde a análise do administrador." });
    }

    if (student.approvalStatus !== 'approved') {
      return res.status(403).json({ message: "Acesso negado. Status de aprovação inválido." });
    }

    req.student = student;
    next();
  } catch (error) {
    console.error("Error checking student approval status:", error);
    res.status(500).json({ message: "Erro ao verificar status de aprovação" });
  }
};
