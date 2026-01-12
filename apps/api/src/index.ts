/* eslint-disable no-console */
import dotenv from "dotenv";
import http from "http";

import { createApp } from "./app.js";
import pool, { runMigrations } from "./database/index.js";
dotenv.config();

const app = createApp(pool);
const server = http.createServer(app);
const port = process.env.PORT || 4000;

const start = async () => {
    try {
        await runMigrations();
        server.listen(port, () => {
            console.log("Server started at port", port);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
        process.exit(1);
    }
};

let isShuttingDown = false;

const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`Received ${signal}. Shutting down...`);

    server?.close(async () => {
        try {
            await pool.end();
            console.log("Shutdown complete");
            process.exit(0);
        } catch (err) {
            console.error("Shutdown error", err);
            process.exit(1);
        }
    });

    setTimeout(() => {
        console.error("Forced shutdown");
        process.exit(1);
    }, 10_000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

start();
