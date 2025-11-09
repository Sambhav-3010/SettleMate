import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Authentication token missing or invalid" });

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};