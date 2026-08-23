import express from "express"
import {
  body,
  checkExact
} from "express-validator"
import {
  listCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryById,
  deleteCategoryById
} from "../controllers/categoryController.js"
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import validateRequest from "../middleware/validationMiddleware.js"

const router = express.Router()

router.use(protect)

router.get(
  "/",
  listCategories
)

router.get(
  "/:id",
  getCategory
)

const categoryCreateValidators = [
  checkExact(
    [
      body("name")
        .trim()
        .notEmpty()
        .withMessage(
          "El nombre es obligatorio"
        ),

      body("description")
        .optional({
          checkFalsy: true
        })
        .isString()
        .withMessage(
          "La descripción no es válida"
        )
    ],
    {
      message:
        "No se permiten campos distintos de name y description"
    }
  )
]

router.post(
  "/",
  authorizeRoles("admin"),
  categoryCreateValidators,
  validateRequest,
  createCategoryHandler
)

const categoryUpdateValidators = [
  checkExact(
    [
      body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "El nombre no puede estar vacío"
        ),

      body("description")
        .optional()
        .isString()
        .withMessage(
          "La descripción no es válida"
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
        "No se permiten campos distintos de name, description e isActive"
    }
  )
]

router.put(
  "/:id",
  authorizeRoles("admin"),
  categoryUpdateValidators,
  validateRequest,
  updateCategoryById
)

router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteCategoryById
)

export default router
