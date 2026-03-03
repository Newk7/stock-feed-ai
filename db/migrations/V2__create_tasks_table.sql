-- V2: Create task tracking tables for S3 manifest jobs
CREATE TABLE task (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         TEXT REFERENCES app_user(id),
    tracking_id     TEXT UNIQUE,
    title           TEXT NOT NULL,
    description     TEXT,
    task_type       TEXT NOT NULL DEFAULT 'news_fetch',
    status          TEXT NOT NULL DEFAULT 'pending',
    s3_prefix       TEXT,
    s3_manifest_key TEXT,
    manifest_data   JSONB,
    metadata        JSONB DEFAULT '{}',
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_user_id ON task(user_id);
CREATE INDEX idx_task_tracking_id ON task(tracking_id);
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_type ON task(task_type);
CREATE INDEX idx_task_created_at ON task(created_at DESC);

CREATE TRIGGER trg_task_updated_at
    BEFORE UPDATE ON task
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
