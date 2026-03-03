import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth.js";
import {
  getWatchlists,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
  saveArticle,
  getSavedArticles,
} from "../services/watchlist.service.js";

const router = Router();

// GET /api/watchlists
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const lists = await getWatchlists(req.user!.uid);
    res.json({ watchlists: lists });
  } catch (error) {
    console.error("Get watchlists error:", error);
    res.status(500).json({ error: "Failed to get watchlists" });
  }
});

// POST /api/watchlists
router.post("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { name, tickers } = req.body;
    const list = await createWatchlist(req.user!.uid, name || "My Watchlist", tickers);
    res.status(201).json({ watchlist: list });
  } catch (error) {
    console.error("Create watchlist error:", error);
    res.status(500).json({ error: "Failed to create watchlist" });
  }
});

// PATCH /api/watchlists/:id
router.patch("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { tickers } = req.body;
    const list = await updateWatchlist(req.params.id as string, req.user!.uid, tickers);
    if (!list) {
      res.status(404).json({ error: "Watchlist not found" });
      return;
    }
    res.json({ watchlist: list });
  } catch (error) {
    console.error("Update watchlist error:", error);
    res.status(500).json({ error: "Failed to update watchlist" });
  }
});

// DELETE /api/watchlists/:id
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const deleted = await deleteWatchlist(req.params.id as string, req.user!.uid);
    if (!deleted) {
      res.status(404).json({ error: "Watchlist not found" });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Delete watchlist error:", error);
    res.status(500).json({ error: "Failed to delete watchlist" });
  }
});

// GET /api/watchlists/saved — saved articles
router.get("/saved", requireAuth, async (req: AuthRequest, res) => {
  try {
    const articles = await getSavedArticles(req.user!.uid);
    res.json({ articles });
  } catch (error) {
    console.error("Get saved articles error:", error);
    res.status(500).json({ error: "Failed to get saved articles" });
  }
});

// POST /api/watchlists/saved/:articleId
router.post("/saved/:articleId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const saved = await saveArticle(req.user!.uid, req.params.articleId as string, req.body.notes);
    res.status(201).json({ saved });
  } catch (error) {
    console.error("Save article error:", error);
    res.status(500).json({ error: "Failed to save article" });
  }
});

export default router;
