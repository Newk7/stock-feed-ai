-- V4: Create manifest_cache for S3 manifest JSON caching
CREATE TABLE manifest_cache (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manifest_id     TEXT UNIQUE NOT NULL,
    tracking_id     TEXT,
    s3_key          TEXT NOT NULL,
    manifest_data   JSONB NOT NULL,
    manifest_type   TEXT NOT NULL DEFAULT 'news',
    status          TEXT NOT NULL DEFAULT 'active',
    fetched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_manifest_cache_manifest_id ON manifest_cache(manifest_id);
CREATE INDEX idx_manifest_cache_tracking_id ON manifest_cache(tracking_id);
CREATE INDEX idx_manifest_cache_type ON manifest_cache(manifest_type);
CREATE INDEX idx_manifest_cache_expires_at ON manifest_cache(expires_at);
