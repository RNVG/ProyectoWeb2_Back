const errorHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = error.statusCode || 500
  let message =
    error.message ||
    "Ocurrió un error interno en el servidor"

  let errors

  if (error.name === "ValidationError") {
    statusCode = 400
    message = "Los datos proporcionados no son válidos"

    errors = Object.values(error.errors).map(
      (validationError) => {
        return validationError.message
      }
    )
  }

  if (error.code === 11000) {
    statusCode = 409

    const duplicatedField = Object.keys(
      error.keyValue || {}
    )[0]

    message = duplicatedField
      ? `El valor del campo ${duplicatedField} ya está registrado`
      : "El registro ya existe"
  }

  if (error.name === "CastError") {
    statusCode = 400
    message = `El identificador ${error.value} no es válido`
  }

  if (
    error instanceof SyntaxError &&
    error.status === 400 &&
    "body" in error
  ) {
    statusCode = 400
    message = "El cuerpo JSON de la solicitud no es válido"
  }

  const response = {
    success: false,
    message
  }

  if (errors) {
    response.errors = errors
  }

  if (
    process.env.NODE_ENV === "development"
  ) {
    response.stack = error.stack
  }

  res.status(statusCode).json(response)
}

export default errorHandler