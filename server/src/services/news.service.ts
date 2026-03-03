import { pool } from "../config/db.js";

export interface NewsFilters {
  category?: string;
  sector?: string;
  ticker?: string;
  sentiment?: string;
  limit?: number;
  offset?: number;
}

export async function getNews(filters: NewsFilters = {}) {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(filters.category);
  }
  if (filters.sector) {
    conditions.push(`sector = $${paramIndex++}`);
    params.push(filters.sector);
  }
  if (filters.ticker) {
    conditions.push(`$${paramIndex++} = ANY(tickers)`);
    params.push(filters.ticker);
  }
  if (filters.sentiment) {
    conditions.push(`sentiment = $${paramIndex++}`);
    params.push(filters.sentiment);
  }

  const where = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const limit = filters.limit || 50;
  const offset = filters.offset || 0;

  params.push(limit, offset);

  const result = await pool.query(
    `SELECT * FROM news_article ${where}
     ORDER BY published_at DESC NULLS LAST, created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    params
  );

  return result.rows;
}

export async function getNewsById(id: string) {
  const result = await pool.query("SELECT * FROM news_article WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

export async function getTrendingNews(limit = 20) {
  const result = await pool.query(
    `SELECT * FROM news_article
     WHERE published_at > NOW() - INTERVAL '24 hours'
     ORDER BY published_at DESC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

export async function getNewsBySector(limit = 10) {
  const result = await pool.query(
    `SELECT sector, json_agg(
       json_build_object(
         'id', id, 'title', title, 'summary', summary, 'source', source,
         'sentiment', sentiment, 'sentiment_score', sentiment_score,
         'tickers', tickers, 'published_at', published_at, 'image_url', image_url
       ) ORDER BY published_at DESC
     ) AS articles
     FROM news_article
     WHERE sector IS NOT NULL AND published_at > NOW() - INTERVAL '7 days'
     GROUP BY sector
     ORDER BY sector`
  );
  return result.rows;
}

export async function getCategories() {
  const result = await pool.query(
    `SELECT DISTINCT category FROM news_article WHERE category IS NOT NULL ORDER BY category`
  );
  return result.rows.map((r: any) => r.category);
}

export async function getSectors() {
  const result = await pool.query(
    `SELECT DISTINCT sector FROM news_article WHERE sector IS NOT NULL ORDER BY sector`
  );
  return result.rows.map((r: any) => r.sector);
}
