import jwt from "jsonwebtoken"
import User from "../models/User.js"
import AppError from "../utils/AppError.js"

const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization

    if (
      !authorization ||
      !authorization.startsWith("Bearer ")
    ) {
      throw new AppError(
        "Debes iniciar sesión para acceder a esta ruta",
        401
      )
    }

    const token = authorization.split(" ")[1]

    if (!token) {
      throw new AppError(
        "No se proporcionó un token válido",
        401
      )
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError(
        "JWT_SECRET no está configurado",
        500
      )
    }

    let decoded

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      )
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError(
          "La sesión ha expirado",
          401
        )
      }

      throw new AppError(
        "El token no es válido",
        401
      )
    }

    const user = await User.findById(
      decoded.userId
    )

    if (!user) {
      throw new AppError(
        "El usuario asociado al token no existe",
        401
      )
    }

    if (!user.isActive) {
      throw new AppError(
        "Esta cuenta se encuentra desactivada",
        403
      )
    }

    req.user = user

    next()
  } catch (error) {
    next(error)
  }
}

export default protect