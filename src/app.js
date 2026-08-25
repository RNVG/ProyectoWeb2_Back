import express from "express"

import cors from "cors"

import helmet from "helmet"

import authRoutes from "./routes/authRoutes.js"

import registrationRoutes from "./routes/registrationRoutes.js"

import favoriteRoutes from "./routes/favoriteRoutes.js"

import notificationRoutes from "./routes/notificationRoutes.js"

import userRoutes from "./routes/userRoutes.js"

import categoryRoutes from "./routes/categoryRoutes.js"

import eventRoutes from "./routes/eventRoutes.js"

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
    limit: "4mb"
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

/*
  Estas rutas deben ir antes de Users y Events
*/

app.use(
  "/api",
  registrationRoutes
)

app.use(
  "/api",
  favoriteRoutes
)

app.use(
  "/api",
  notificationRoutes
)

app.use(
  "/api/users",
  userRoutes
)

app.use(
  "/api/categories",
  categoryRoutes
)

app.use(
  "/api/events",
  eventRoutes
)

app.use(notFound)

app.use(errorHandler)

export default app