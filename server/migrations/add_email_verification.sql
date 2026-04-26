-- Fix 1: Widen token columns to handle AES-256-GCM encrypted strings (which are longer)
ALTER TABLE users ALTER COLUMN google_access_token TYPE TEXT;
ALTER TABLE users ALTER COLUMN google_refresh_token TYPE TEXT;

-- Fix 3: Add email verification columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;
