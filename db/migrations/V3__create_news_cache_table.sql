-- V3: Create news_cache for caching S3 manifest news data locally
CREATE TABLE news_article (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manifest_id     TEXT,
    s3_key          TEXT,
    title           TEXT NOT NULL,
    summary         TEXT,
    content         TEXT,
    source          TEXT,
    author          TEXT,
    category        TEXT,
    sector          TEXT,
    tickers         TEXT[] DEFAULT '{}',
    sentiment       TEXT,
    sentiment_score NUMERIC(5,4),
    image_url       TEXT,
    source_url      TEXT,
    published_at    TIMESTAMPTZ,
    fetched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_news_article_manifest_id ON news_article(manifest_id);
CREATE INDEX idx_news_article_category ON news_article(category);
CREATE INDEX idx_news_article_sector ON news_article(sector);
CREATE INDEX idx_news_article_tickers ON news_article USING GIN(tickers);
CREATE INDEX idx_news_article_sentiment ON news_article(sentiment);
CREATE INDEX idx_news_article_published_at ON news_article(published_at DESC);
CREATE INDEX idx_news_article_created_at ON news_article(created_at DESC);

CREATE TRIGGER trg_news_article_updated_at
    BEFORE UPDATE ON news_article
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
