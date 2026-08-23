import "dotenv/config"
import app from "./app.js"
import connectDatabase from "./config/database.js"

const PORT = process.env.PORT || 4000

const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("No se pudo iniciar el servidor")
    process.exit(1)
  }
}

startServer()