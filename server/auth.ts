
import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export async function isAuthenticated(req: any, res: Response, next: NextFunction) {
  if (req.user && req.user.claims && req.user.claims.sub) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado" });
}

export async function isAdmin(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: "Erro ao verificar permissões" });
  }
}

export async function isDriver(req: any, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.claims || !req.user.claims.sub) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    
    if (!user || !user.isDriver) {
      return res.status(403).json({ message: "Acesso negado - motorista necessário" });
    }

    next();
  } catch (error) {
    console.error("Error in isDriver middleware:", error);
    res.status(500).json({ message: "Erro ao verificar permissões" });
  }
}
