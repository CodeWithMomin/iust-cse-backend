import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit"
import { config } from "./config/env.js"
import errorHandler from "./middlewares/error.middleware.js"
import authRoutes from "./routes/auth.routes.js"

const app = express()

// CORS
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
})
app.use("/api", limiter)

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many auth attempts, please try again later." },
})
app.use("/api/v1/auth/login", authLimiter)
app.use("/api/v1/auth/register", authLimiter)

// Body parsers
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" })
})

// Routes
app.use("/api/v1/auth", authRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// Global error handler
app.use(errorHandler)

export default app
