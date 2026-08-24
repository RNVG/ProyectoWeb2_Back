import express from "express"
import {
  body,
  checkExact
} from "express-validator"
import {
  listUsers,
  getUser,
  updateUserById,
  deleteUserById
} from "../controllers/userController.js"
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import validateRequest from "../middleware/validationMiddleware.js"

const router = express.Router()

router.use(
  protect,
  authorizeRoles("admin")
)

router.get(
  "/",
  listUsers
)

router.get(
  "/:id",
  getUser
)

const userUpdateValidators = [
  checkExact(
    [
      body("firstName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "El nombre no puede estar vacío"
        ),

      body("lastName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "El apellido no puede estar vacío"
        ),

      body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "El correo no puede estar vacío"
        )
        .isEmail()
        .withMessage(
          "El correo no es válido"
        ),

      body("password")
        .optional()
        .isString()
        .withMessage(
          "La contraseña no es válida"
        )
        .isLength({
          min: 8
        })
        .withMessage(
          "La contraseña debe tener al menos 8 caracteres"
        ),

      body("role")
        .optional()
        .isIn([
          "admin",
          "organizer",
          "user"
        ])
        .withMessage(
          "El rol debe ser admin, organizer o user"
        ),

      body("isActive")
        .optional()
        .isBoolean()
        .withMessage(
          "isActive debe ser un valor booleano"
        )
    ],
    {
      message:
        "No se permiten campos distintos de firstName, lastName, email, password, role e isActive"
    }
  )
]

router.put(
  "/:id",
  userUpdateValidators,
  validateRequest,
  updateUserById
)

router.patch(
  "/:id",
  userUpdateValidators,
  validateRequest,
  updateUserById
)

router.delete(
  "/:id",
  deleteUserById
)

export default router