import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import { upsertUser, getUserById, updateUserPreferences } from "../services/user.service.js";

const router = Router();

// POST /api/auth/login — upsert user on login
router.post("/login", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { displayName, photoUrl } = req.body;
    const user = await upsertUser(
      req.user!.uid,
      req.user!.email,
      displayName || req.user!.displayName,
      photoUrl
    );
    res.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to process login" });
  }
});

// GET /api/auth/me — get current user
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await getUserById(req.user!.uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// PATCH /api/auth/preferences — update user preferences
router.patch("/preferences", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await updateUserPreferences(req.user!.uid, req.body);
    res.json({ user });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

export default router;
