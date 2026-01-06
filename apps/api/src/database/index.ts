import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();
const {
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_HOST,
} = process.env;
const url =
    `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}` ||
    "MISSING";

const pool = new Pool({
    connectionString: url,
    ssl: false,
});

const enableCitext = async (): Promise<void> => {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS citext;`);
};

const createUsersTable = async (): Promise<void> => {
    await pool.query(`
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');
        END IF;
    END$$;`);

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
};

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
  `;
    await pool.query(query);
};

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
};

export const initDb = async () => {
    await pool.query("SELECT 1"); // test connection

    await enableCitext();
    await createUsersTable();
    await createRefreshTokenTable();
    await createUpdatedAtTrigger();
    console.log("Database initialized");
};

export default pool;
