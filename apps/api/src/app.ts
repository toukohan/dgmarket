import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { Db, DbRequest } from "./database/index.js";
import { dbMiddleware } from "./middleware/dbMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/producRouter.js";

dotenv.config();

export function createApp(db: Db) {
    const app = express();
    app.use(dbMiddleware(db));

    app.use(
        helmet({
            contentSecurityPolicy: false, // for development
        }),
    );
    const corsOptions: CorsOptions = {
        origin: process.env.CORS_ORIGIN?.split(",") || [
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());

    app.get("/api/health", (req: DbRequest, res) => {
        res.json({ ok: true });
    });
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter);
    app.use(errorHandler);
    return app;
}
