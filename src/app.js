import express from "express"
import cors from "cors"
import helmet from "helmet"
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import notFound from "./middleware/notFoundMiddleware.js"
import errorHandler from "./middleware/errorMiddleware.js"

const app = express()

app.use(helmet())

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
)

app.use(
  express.json({
    limit: "1mb"
  })
)

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bienvenido a CommunityHub API"
  })
})

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CommunityHub API funcionando correctamente"
  })
})

app.use(
  "/api/auth",
  authRoutes
)

app.use(
  "/api/users",
  userRoutes
)

app.use(notFound)
app.use(errorHandler)

export default app