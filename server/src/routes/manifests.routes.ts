import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import {
  fetchManifest,
  syncManifestsFromS3,
  getLatestManifests,
} from "../services/manifest.service.js";
import { listObjectKeys } from "../services/s3.service.js";

const router = Router();

// GET /api/manifests — list cached manifests
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const type = req.query.type as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const manifests = await getLatestManifests(type, limit);
    res.json({ manifests });
  } catch (error) {
    console.error("List manifests error:", error);
    res.status(500).json({ error: "Failed to list manifests" });
  }
});

// GET /api/manifests/fetch — fetch a single manifest from S3
router.get("/fetch", requireAuth, async (req: AuthRequest, res) => {
  try {
    const key = req.query.key as string;
    if (!key) {
      res.status(400).json({ error: "Missing key parameter" });
      return;
    }
    const data = await fetchManifest(key);
    res.json({ manifest: data });
  } catch (error) {
    console.error("Fetch manifest error:", error);
    res.status(500).json({ error: "Failed to fetch manifest" });
  }
});

// POST /api/manifests/sync — sync manifests from S3 prefix
router.post("/sync", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { prefix, bucket } = req.body;
    if (!prefix) {
      res.status(400).json({ error: "Missing prefix" });
      return;
    }
    const result = await syncManifestsFromS3(prefix, bucket);
    res.json(result);
  } catch (error) {
    console.error("Sync manifests error:", error);
    res.status(500).json({ error: "Failed to sync manifests" });
  }
});

// GET /api/manifests/keys — list S3 keys by prefix
router.get("/keys", requireAuth, async (req: AuthRequest, res) => {
  try {
    const prefix = req.query.prefix as string;
    if (!prefix) {
      res.status(400).json({ error: "Missing prefix parameter" });
      return;
    }
    const keys = await listObjectKeys(prefix);
    res.json({ keys });
  } catch (error) {
    console.error("List keys error:", error);
    res.status(500).json({ error: "Failed to list S3 keys" });
  }
});

export default router;
