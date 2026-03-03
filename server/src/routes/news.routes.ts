import { Router } from "express";
import {
  getNews,
  getNewsById,
  getTrendingNews,
  getNewsBySector,
  getCategories,
  getSectors,
} from "../services/news.service.js";

const router = Router();

// GET /api/news — list news articles with optional filters
router.get("/", async (req, res) => {
  try {
    const articles = await getNews({
      category: req.query.category as string,
      sector: req.query.sector as string,
      ticker: req.query.ticker as string,
      sentiment: req.query.sentiment as string,
      limit: parseInt(req.query.limit as string) || 50,
      offset: parseInt(req.query.offset as string) || 0,
    });
    res.json({ articles });
  } catch (error) {
    console.error("Get news error:", error);
    res.status(500).json({ error: "Failed to get news" });
  }
});

// GET /api/news/trending — trending articles last 24h
router.get("/trending", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const articles = await getTrendingNews(limit);
    res.json({ articles });
  } catch (error) {
    console.error("Get trending news error:", error);
    res.status(500).json({ error: "Failed to get trending news" });
  }
});

// GET /api/news/sectors — news grouped by sector
router.get("/sectors", async (_req, res) => {
  try {
    const sectors = await getNewsBySector();
    res.json({ sectors });
  } catch (error) {
    console.error("Get news by sector error:", error);
    res.status(500).json({ error: "Failed to get news by sector" });
  }
});

// GET /api/news/categories — list categories
router.get("/categories", async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to get categories" });
  }
});

// GET /api/news/sectors/list — list sectors
router.get("/sectors/list", async (_req, res) => {
  try {
    const sectors = await getSectors();
    res.json({ sectors });
  } catch (error) {
    res.status(500).json({ error: "Failed to get sectors" });
  }
});

// GET /api/news/:id — single article
router.get("/:id", async (req, res) => {
  try {
    const article = await getNewsById(req.params.id);
    if (!article) {
      res.status(404).json({ error: "Article not found" });
      return;
    }
    res.json({ article });
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ error: "Failed to get article" });
  }
});

export default router;
