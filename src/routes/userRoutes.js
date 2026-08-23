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

router.put(
  "/:id",
  [
    checkExact(
      [
        body("role")
          .optional()
          .isIn(["admin", "organizer", "user"])
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
        message: "No se permiten campos distintos de role e isActive"
      }
    )
  ],
  validateRequest,
  updateUserById
)

router.delete(
  "/:id",
  deleteUserById
)

export default router
