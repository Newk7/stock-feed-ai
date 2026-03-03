-- V5: Create watchlist and saved articles for user personalization
CREATE TABLE watchlist (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT NOT NULL REFERENCES app_user(id),
    name        TEXT NOT NULL DEFAULT 'Default',
    tickers     TEXT[] DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);

CREATE TRIGGER trg_watchlist_updated_at
    BEFORE UPDATE ON watchlist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE saved_article (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT NOT NULL REFERENCES app_user(id),
    article_id  UUID NOT NULL REFERENCES news_article(id),
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, article_id)
);

CREATE INDEX idx_saved_article_user_id ON saved_article(user_id);
