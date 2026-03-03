import { Request, Response, NextFunction } from "express";
import { getFirebaseAuth } from "../config/firebase.js";
import { pool } from "../config/db.js";
import { env } from "../config/env.js";

export interface AuthUser {
  uid: string;
  email: string;
  role: string;
  displayName?: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing authorization token" });
    return;
  }

  try {
    const token = authHeader.split("Bearer ")[1];

    // Dev mode fallback
    if (env.NODE_ENV === "development" && token === "dev-token") {
      req.user = {
        uid: "dev-user-001",
        email: "dev@smartwire.local",
        role: "admin",
        displayName: "Dev User",
      };
      next();
      return;
    }

    const decoded = await getFirebaseAuth().verifyIdToken(token!);

    // Look up user role from Postgres
    const result = await pool.query(
      "SELECT role, display_name FROM app_user WHERE id = $1 AND active = true",
      [decoded.uid]
    );

    const dbUser = result.rows[0];
    req.user = {
      uid: decoded.uid,
      email: decoded.email || "",
      role: dbUser?.role || "user",
      displayName: dbUser?.display_name || decoded.name,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Insufficient permissions" });
    return;
  }
  next();
};
