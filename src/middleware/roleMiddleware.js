import AppError from "../utils/AppError.js"

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError(
          "No se encontró un usuario autenticado",
          401
        )
      )
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          "No tienes permisos para realizar esta acción",
          403
        )
      )
    }

    next()
  }
}

export default authorizeRoles