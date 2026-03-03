import { pool } from "../config/db.js";
import { getObjectFromS3, listObjectKeys } from "./s3.service.js";

export interface ManifestData {
  id: string;
  type: string;
  articles?: any[];
  market_data?: any;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export async function fetchManifest(s3Key: string): Promise<ManifestData> {
  const data = await getObjectFromS3(s3Key);
  return data as ManifestData;
}

export async function syncManifestsFromS3(
  prefix: string,
  bucket?: string
): Promise<{ synced: number; errors: number }> {
  const keys = await listObjectKeys(prefix, bucket);
  const manifestKeys = keys.filter((k) => k.endsWith(".json"));

  let synced = 0;
  let errors = 0;

  for (const key of manifestKeys) {
    try {
      const data = await getObjectFromS3(key, bucket);
      const manifestId = data.id || key;

      await pool.query(
        `INSERT INTO manifest_cache (manifest_id, tracking_id, s3_key, manifest_data, manifest_type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (manifest_id) DO UPDATE SET
           manifest_data = EXCLUDED.manifest_data,
           fetched_at = NOW(),
           expires_at = NOW() + INTERVAL '24 hours'`,
        [
          manifestId,
          data.tracking_id || null,
          key,
          JSON.stringify(data),
          data.type || "news",
        ]
      );

      // If it contains articles, cache them individually
      if (data.articles && Array.isArray(data.articles)) {
        for (const article of data.articles) {
          await cacheNewsArticle(article, manifestId, key);
        }
      }

      synced++;
    } catch (err) {
      console.error(`Failed to sync manifest ${key}:`, err);
      errors++;
    }
  }

  return { synced, errors };
}

async function cacheNewsArticle(
  article: any,
  manifestId: string,
  s3Key: string
): Promise<void> {
  await pool.query(
    `INSERT INTO news_article (manifest_id, s3_key, title, summary, content, source, author, category, sector, tickers, sentiment, sentiment_score, image_url, source_url, published_at, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
     ON CONFLICT DO NOTHING`,
    [
      manifestId,
      s3Key,
      article.title,
      article.summary || null,
      article.content || null,
      article.source || null,
      article.author || null,
      article.category || null,
      article.sector || null,
      article.tickers || [],
      article.sentiment || null,
      article.sentiment_score || null,
      article.image_url || null,
      article.source_url || null,
      article.published_at || null,
      JSON.stringify(article.metadata || {}),
    ]
  );
}

export async function getLatestManifests(
  type?: string,
  limit = 20
): Promise<any[]> {
  const query = type
    ? `SELECT * FROM manifest_cache WHERE manifest_type = $1 AND expires_at > NOW() ORDER BY fetched_at DESC LIMIT $2`
    : `SELECT * FROM manifest_cache WHERE expires_at > NOW() ORDER BY fetched_at DESC LIMIT $1`;

  const params = type ? [type, limit] : [limit];
  const result = await pool.query(query, params);
  return result.rows;
}
