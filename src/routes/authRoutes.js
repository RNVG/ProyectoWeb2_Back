import express from "express"
import {
  body
} from "express-validator"
import {
  register,
  login,
  getCurrentUser,
  logout
} from "../controllers/authController.js"
import protect from "../middleware/authMiddleware.js"
import validateRequest from "../middleware/validationMiddleware.js"

const router = express.Router()

router.post(
  "/register",
  [
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("El nombre es obligatorio"),

    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("El apellido es obligatorio"),

    body("email")
      .trim()
      .notEmpty()
      .withMessage("El correo es obligatorio")
      .isEmail()
      .withMessage("El correo no es válido"),

    body("password")
      .isString()
      .withMessage("La contraseña no es válida")
      .isLength({
        min: 8
      })
      .withMessage(
        "La contraseña debe tener al menos 8 caracteres"
      ),

    body("profilePicture")
      .optional({
        checkFalsy: true
      })
      .isString()
      .withMessage(
        "La foto de perfil no es válida"
      )
  ],
  validateRequest,
  register
)

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("El correo es obligatorio")
      .isEmail()
      .withMessage("El correo no es válido"),

    body("password")
      .notEmpty()
      .withMessage("La contraseña es obligatoria")
  ],
  validateRequest,
  login
)

router.get(
  "/me",
  protect,
  getCurrentUser
)

router.post(
  "/logout",
  protect,
  logout
)

export default router