import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));
app.use(express.json({ limit: "10mb" }));

registerRoutes(app);

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(env.PORT, () => {
  console.log(`Agentic SmartWire server running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`S3 Endpoint: ${env.AWS_ENDPOINT_URL || "AWS Default"}`);
});
