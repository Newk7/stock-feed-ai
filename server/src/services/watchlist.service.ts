import { pool } from "../config/db.js";

export async function getWatchlists(userId: string) {
  const result = await pool.query(
    "SELECT * FROM watchlist WHERE user_id = $1 ORDER BY created_at",
    [userId]
  );
  return result.rows;
}

export async function createWatchlist(
  userId: string,
  name: string,
  tickers: string[] = []
) {
  const result = await pool.query(
    "INSERT INTO watchlist (user_id, name, tickers) VALUES ($1, $2, $3) RETURNING *",
    [userId, name, tickers]
  );
  return result.rows[0];
}

export async function updateWatchlist(
  id: string,
  userId: string,
  tickers: string[]
) {
  const result = await pool.query(
    "UPDATE watchlist SET tickers = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [tickers, id, userId]
  );
  return result.rows[0] || null;
}

export async function deleteWatchlist(id: string, userId: string) {
  const result = await pool.query(
    "DELETE FROM watchlist WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, userId]
  );
  return result.rowCount! > 0;
}

export async function saveArticle(userId: string, articleId: string, notes?: string) {
  const result = await pool.query(
    `INSERT INTO saved_article (user_id, article_id, notes)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, article_id) DO UPDATE SET notes = EXCLUDED.notes
     RETURNING *`,
    [userId, articleId, notes || null]
  );
  return result.rows[0];
}

export async function getSavedArticles(userId: string) {
  const result = await pool.query(
    `SELECT sa.*, na.title, na.summary, na.source, na.category, na.sector,
            na.tickers, na.sentiment, na.published_at, na.image_url
     FROM saved_article sa
     JOIN news_article na ON na.id = sa.article_id
     WHERE sa.user_id = $1
     ORDER BY sa.created_at DESC`,
    [userId]
  );
  return result.rows;
}
