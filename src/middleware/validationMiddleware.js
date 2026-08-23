import {
  validationResult
} from "express-validator"

const validateRequest = (
  req,
  res,
  next
) => {
  const validationErrors =
    validationResult(req)

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Los datos proporcionados no son válidos",
      errors: validationErrors.array().map(
        (error) => {
          return {
            field: error.path,
            message: error.msg
          }
        }
      )
    })
  }

  next()
}

export default validateRequest