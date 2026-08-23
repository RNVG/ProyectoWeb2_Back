import mongoose from "mongoose"

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB conectado: ${connection.connection.host}`)
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`)
    throw error
  }
}

export default connectDatabase