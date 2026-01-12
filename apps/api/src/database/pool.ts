import { Pool } from "pg";

const {
    DATABASE_URL,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_HOST,
    NODE_ENV,
} = process.env;

let connectionString: string;

if (DATABASE_URL) {
    connectionString = DATABASE_URL;
} else {
    if (!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_HOST) {
        throw new Error("Postgres environment variables are not fully defined");
    }

    connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}

export const pool = new Pool({
    connectionString,
    ssl: NODE_ENV === "production" ? false : false, // ssl false when using docker postgres
});
