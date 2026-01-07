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

if (!POSTGRES_DB) {
    throw new Error("POSTGRES_DB is not defined");
}

const connectionString = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

export const pool = new Pool({
    connectionString,
    ssl: false,
});
