import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/authRouter";
import productRouter from "./routes/producRouter";


dotenv.config({
    path: "./.env.test"
})
export function createApp(env: string = "dev") {

    console.log("db:", process.env.POSTGRES_DB)

    const app = express();
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
    app.get("/api/health", (_req, res) => {
        res.json({ ok: true });
    });
    app.use("/api/auth", authRouter);
    app.use("/api/products", productRouter);
    app.use(errorHandler);
    return app;
}
