/* eslint-disable no-console */
import dotenv from "dotenv";

import { createApp } from "./app.js";
import pool, { runMigrations } from "./database/index.js";
dotenv.config();

const app = createApp(pool);
const port = process.env.PORT || 4000;

const start = async () => {
    try {
        await runMigrations();
        app.listen(port, () => {
            console.log("Server started at port", port);
        });
    } catch (err) {
        console.error("Server failed to start:", err);
        process.exit(1);
    }
};

start();
