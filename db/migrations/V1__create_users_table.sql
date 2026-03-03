-- V1: Create app_user table for Firebase-authenticated users
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE app_user (
    id            TEXT PRIMARY KEY,           -- Firebase UID
    email         TEXT NOT NULL UNIQUE,
    display_name  TEXT,
    photo_url     TEXT,
    role          TEXT NOT NULL DEFAULT 'user',
    active        BOOLEAN NOT NULL DEFAULT true,
    preferences   JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_app_user_email ON app_user(email);
CREATE INDEX idx_app_user_role ON app_user(role);

CREATE TRIGGER trg_app_user_updated_at
    BEFORE UPDATE ON app_user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
