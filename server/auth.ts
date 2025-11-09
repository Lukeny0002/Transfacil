import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: "Não autorizado" });
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user?.isAdmin) {
    return next();
  }
  res.status(403).json({ message: "Acesso negado" });
}

export function isDriver(req: Request, res: Response, next: NextFunction) {
  if (req.session.user?.isDriver) {
    return next();
  }
  res.status(403).json({ message: "Acesso negado" });
}