import type { Request, Response, NextFunction } from "express";
import { JwtService } from "./JwtService";

// middleware that verifies a Bearer token, attaches the payload to req.user
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const token = parts[1];
  try {
    const payload = new JwtService().verify(token);
    // attach user info to request for later handlers
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};