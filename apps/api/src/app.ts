import express from 'express'
import cors, { CorsOptions } from 'cors'
import helmet from 'helmet'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import authRouter from "./routes/authRouter"
import discRouter from "./routes/discRouter"
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

export function createApp() {
    const app = express()
    app.use(helmet({
        contentSecurityPolicy: false // for development
    }))
    const corsOptions: CorsOptions = {
        origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    }
    app.use(cors(corsOptions))
    app.use(cookieParser())
    app.use(express.json())
    app.get("/api/health", (_req, res) => {
        res.json({ok: true})
    })
    app.use("/api/auth", authRouter)
    app.use("/api/discs", discRouter)
    app.use(errorHandler)
    return app
}