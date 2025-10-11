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
