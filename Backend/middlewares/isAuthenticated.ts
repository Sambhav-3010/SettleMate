import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const isAuth = (req as any).isAuthenticated?.();

  if (isAuth && req.user) {
    return next();
  }

  return res.status(401).json({ message: "Unauthorized: Please log in first." });
}