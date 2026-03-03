export const env = {
  PORT: parseInt(process.env.PORT || "3001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://smartwire:smartwire_dev@localhost:5433/smartwire",
  CORS_ORIGINS: (process.env.CORS_ORIGINS || "http://localhost:5173").split(
    ","
  ),

  // S3
  AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL || "",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  S3_BUCKET: process.env.S3_BUCKET || "agentic-smartwire",

  // Firebase Admin
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  ),
};
