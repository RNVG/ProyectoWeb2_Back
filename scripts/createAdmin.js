import dotenv from "dotenv"
import connectDatabase from "../src/config/database.js"
import User from "../src/models/User.js"
import mongoose from "mongoose"

dotenv.config()

const [
  email,
  password,
  firstName,
  lastName
] = process.argv.slice(2)

const run = async () => {
  if (
    !email ||
    !password ||
    !firstName ||
    !lastName
  ) {
    console.error(
      "Uso: npm run create-admin -- <email> <password> <firstName> <lastName>"
    )
    process.exit(1)
  }

  if (password.length < 8) {
    console.error(
      "La contraseña debe tener al menos 8 caracteres"
    )
    process.exit(1)
  }

  await connectDatabase()

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const existingUser = await User.findOne({
    email: normalizedEmail
  })

  if (existingUser) {
    if (existingUser.role === "admin") {
      console.log(
        `El usuario ${normalizedEmail} ya es administrador`
      )
    } else {
      existingUser.role = "admin"
      await existingUser.save()

      console.log(
        `Usuario ${normalizedEmail} actualizado a rol admin`
      )
    }
  } else {
    await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      role: "admin"
    })

    console.log(
      `Administrador ${normalizedEmail} creado correctamente`
    )
  }

  await mongoose.disconnect()

  process.exit(0)
}

run().catch((error) => {
  console.error(
    "No se pudo crear/actualizar el administrador:",
    error.message
  )

  process.exit(1)
})