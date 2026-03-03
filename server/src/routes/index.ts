import { Express } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import newsRoutes from "./news.routes.js";
import manifestsRoutes from "./manifests.routes.js";
import watchlistRoutes from "./watchlist.routes.js";
import adminRoutes from "./admin.routes.js";

export function registerRoutes(app: Express): void {
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/news", newsRoutes);
  app.use("/api/manifests", manifestsRoutes);
  app.use("/api/watchlists", watchlistRoutes);
  app.use("/api/admin", adminRoutes);
}
