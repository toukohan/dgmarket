import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config()
const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_HOST } = process.env
const url = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}` || "MISSING"

const pool = new Pool({
    connectionString: url,
    ssl: false
})

const enableCitext  = async (): Promise<void> => {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS citext;`);
}

const createUsersTable = async (): Promise<void> => {
  await pool.query(`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
        END IF;
    END$$;`
  );

  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email CITEXT NOT NULL,
      name TEXT NOT NULL,
      role user_role NOT NULL DEFAULT 'user',
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      CONSTRAINT users_email_unique UNIQUE (email)
    );
  `;

  await pool.query(query);
}

const createRefreshTokenTable = async () => {
    const query = `
            CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            token_hash TEXT NOT NULL,
            user_agent TEXT,
            ip_address TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            expires_at TIMESTAMPTZ NOT NULL,
            revoked_at TIMESTAMPTZ,
            CONSTRAINT token_hash_unique UNIQUE (token_hash)
        );
    `
    await pool.query(query);
}

const createUpdatedAtTrigger = async () => {
  await pool.query(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS set_users_updated_at ON users;
    CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

const createDiscsTable = async (): Promise<void> => {
  await pool.query(`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'disc_condition') THEN
            CREATE TYPE disc_condition AS ENUM ('new', 'like_new', 'used', 'heavily_used');
        END IF;
    END$$;
  `);

  const query = `
    CREATE TABLE IF NOT EXISTS discs (
      id SERIAL PRIMARY KEY,
      seller_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      speed INT NOT NULL CHECK (speed >= 1 AND speed <= 14),
      glide INT NOT NULL CHECK (glide >= 1 AND glide <= 7),
      turn DECIMAL(3,1) NOT NULL CHECK (turn >= -5.0 AND turn <= 1.0),
      fade DECIMAL(3,1) NOT NULL CHECK (fade >= 0.0 AND fade <= 5.0),
      weight_grams INT NOT NULL CHECK (weight_grams >= 140 AND weight_grams <= 180),
      plastic_type TEXT NOT NULL,
      condition disc_condition NOT NULL DEFAULT 'new',
      price_cents INT NOT NULL CHECK (price_cents > 0),
      description TEXT,
      image_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
      hidden BOOLEAN NOT NULL DEFAULT FALSE,
      sold BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_discs_seller_id ON discs(seller_id);
    CREATE INDEX IF NOT EXISTS idx_discs_brand ON discs(brand);
    CREATE INDEX IF NOT EXISTS idx_discs_model ON discs(model);
    CREATE INDEX IF NOT EXISTS idx_discs_price_cents ON discs(price_cents);
    CREATE INDEX IF NOT EXISTS idx_discs_created_at ON discs(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_discs_hidden ON discs(hidden);
    CREATE INDEX IF NOT EXISTS idx_discs_sold ON discs(sold);
  `;

  await pool.query(query);

  // Add columns if they don't exist (for existing databases)
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='discs' AND column_name='hidden') THEN
        ALTER TABLE discs ADD COLUMN hidden BOOLEAN NOT NULL DEFAULT FALSE;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='discs' AND column_name='sold') THEN
        ALTER TABLE discs ADD COLUMN sold BOOLEAN NOT NULL DEFAULT FALSE;
      END IF;
    END$$;
  `);

  // Create indexes if they don't exist
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_discs_hidden ON discs(hidden);
    CREATE INDEX IF NOT EXISTS idx_discs_sold ON discs(sold);
  `);

  await pool.query(`
    DROP TRIGGER IF EXISTS set_discs_updated_at ON discs;
    CREATE TRIGGER set_discs_updated_at
    BEFORE UPDATE ON discs
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
}

export const initDb = async () => {
    await pool.query("SELECT 1"); // test connection

    await enableCitext()
    await createUsersTable()
    await createRefreshTokenTable()
    await createUpdatedAtTrigger()
    await createDiscsTable()
    console.log("Database initialized")
}

export default pool