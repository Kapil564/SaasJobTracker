import pool from "./db.js";

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name        TEXT,
        email       TEXT UNIQUE NOT NULL,
        password    TEXT,
        avatar      TEXT,
        role        TEXT DEFAULT 'user',
        is_verified BOOLEAN DEFAULT FALSE,
        resume_text TEXT,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token      TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS google_tokens (
        id                   TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id              TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        google_id            TEXT UNIQUE NOT NULL,
        google_access_token  TEXT,
        google_refresh_token TEXT,
        expires_at           TIMESTAMP,
        created_at           TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        company         TEXT NOT NULL,
        role            TEXT NOT NULL,
        status          TEXT DEFAULT 'SAVED',
        job_url         TEXT,
        job_description TEXT,
        notes           TEXT,
        match_score     INT,
        location        TEXT,
        salary          TEXT,
        source          TEXT,
        applied_date    TIMESTAMP DEFAULT NOW(),
        follow_up_date  TIMESTAMP,
        created_at      TIMESTAMP DEFAULT NOW(),
        updated_at      TIMESTAMP DEFAULT NOW(),
        user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        text            TEXT NOT NULL,
        type            TEXT DEFAULT 'STATUS_CHANGE',
        created_at      TIMESTAMP DEFAULT NOW(),
        application_id  TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cover_letters (
        id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        application_id  TEXT UNIQUE NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
        body            TEXT NOT NULL,
        created_at      TIMESTAMP DEFAULT NOW(),
        updated_at      TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ All tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};

createTables();