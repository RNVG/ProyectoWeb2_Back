import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"
import AppError from "../utils/AppError.js"

const formatUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const registerUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    profilePicture
  } = userData

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password
  ) {
    throw new AppError(
      "Nombre, apellido, correo y contraseña son obligatorios",
      400
    )
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const existingUser = await User.findOne({
    email: normalizedEmail
  })

  if (existingUser) {
    throw new AppError(
      "El correo electrónico ya está registrado",
      409
    )
  }

  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password,
    profilePicture: profilePicture || null,
    lastLogin: new Date()
  })

  const token = generateToken(user._id)

  return {
    token,
    user: formatUser(user)
  }
}

const loginUser = async (
  email,
  password
) => {
  if (!email || !password) {
    throw new AppError(
      "El correo y la contraseña son obligatorios",
      400
    )
  }

  const normalizedEmail = email
    .trim()
    .toLowerCase()

  const user = await User.findOne({
    email: normalizedEmail
  }).select("+password")

  if (
    !user ||
    !(await user.comparePassword(password))
  ) {
    throw new AppError(
      "Correo o contraseña incorrectos",
      401
    )
  }

  if (!user.isActive) {
    throw new AppError(
      "Esta cuenta se encuentra desactivada",
      403
    )
  }

  user.lastLogin = new Date()

  await user.save()

  const token = generateToken(user._id)

  return {
    token,
    user: formatUser(user)
  }
}

export {
  registerUser,
  loginUser
}