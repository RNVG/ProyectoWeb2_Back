import express from "express"
import {
  body,
  checkExact
} from "express-validator"
import {
  listEvents,
  getEvent,
  createEventHandler,
  updateEventById,
  deleteEventById
} from "../controllers/eventController.js"
import protect from "../middleware/authMiddleware.js"
import authorizeRoles from "../middleware/roleMiddleware.js"
import validateRequest from "../middleware/validationMiddleware.js"

const router = express.Router()

router.use(protect)

router.get(
  "/",
  listEvents
)

router.get(
  "/:id",
  getEvent
)

const eventCreateValidators = [
  checkExact(
    [
      body("title")
        .trim()
        .notEmpty()
        .withMessage(
          "El título es obligatorio"
        ),

      body("description")
        .trim()
        .notEmpty()
        .withMessage(
          "La descripción es obligatoria"
        ),

      body("category")
        .notEmpty()
        .withMessage(
          "La categoría es obligatoria"
        )
        .isMongoId()
        .withMessage(
          "La categoría no es válida"
        ),

      body("startDate")
        .notEmpty()
        .withMessage(
          "La fecha de inicio es obligatoria"
        )
        .isISO8601()
        .withMessage(
          "La fecha de inicio no es válida"
        )
        .toDate(),

      body("endDate")
        .notEmpty()
        .withMessage(
          "La fecha de finalización es obligatoria"
        )
        .isISO8601()
        .withMessage(
          "La fecha de finalización no es válida"
        )
        .toDate(),

      body("modality")
        .optional()
        .isIn(["in-person", "virtual", "hybrid"])
        .withMessage(
          "La modalidad debe ser in-person, virtual o hybrid"
        ),

      body("location")
        .optional()
        .isObject()
        .withMessage(
          "location debe ser un objeto"
        ),

      body("capacity")
        .notEmpty()
        .withMessage(
          "La capacidad es obligatoria"
        )
        .isInt({
          min: 1
        })
        .withMessage(
          "La capacidad debe ser un número entero mayor o igual a 1"
        ),

      body("imageUrl")
        .optional({
          checkFalsy: true
        })
        .isString()
        .withMessage(
          "imageUrl no es válida"
        ),

      body("status")
        .optional()
        .isIn(["draft", "published", "cancelled", "completed"])
        .withMessage(
          "El estado debe ser draft, published, cancelled o completed"
        )
    ],
    {
      message:
        "No se permiten campos distintos de title, description, category, startDate, endDate, modality, location, capacity, imageUrl y status"
    }
  )
]

router.post(
  "/",
  authorizeRoles("admin", "organizer"),
  eventCreateValidators,
  validateRequest,
  createEventHandler
)

const eventUpdateValidators = [
  checkExact(
    [
      body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "El título no puede estar vacío"
        ),

      body("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage(
          "La descripción no puede estar vacía"
        ),

      body("category")
        .optional()
        .isMongoId()
        .withMessage(
          "La categoría no es válida"
        ),

      body("startDate")
        .optional()
        .isISO8601()
        .withMessage(
          "La fecha de inicio no es válida"
        )
        .toDate(),

      body("endDate")
        .optional()
        .isISO8601()
        .withMessage(
          "La fecha de finalización no es válida"
        )
        .toDate(),

      body("modality")
        .optional()
        .isIn(["in-person", "virtual", "hybrid"])
        .withMessage(
          "La modalidad debe ser in-person, virtual o hybrid"
        ),

      body("location")
        .optional()
        .isObject()
        .withMessage(
          "location debe ser un objeto"
        ),

      body("capacity")
        .optional()
        .isInt({
          min: 1
        })
        .withMessage(
          "La capacidad debe ser un número entero mayor o igual a 1"
        ),

      body("imageUrl")
        .optional({
          checkFalsy: true
        })
        .isString()
        .withMessage(
          "imageUrl no es válida"
        ),

      body("status")
        .optional()
        .isIn(["draft", "published", "cancelled", "completed"])
        .withMessage(
          "El estado debe ser draft, published, cancelled o completed"
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
        "No se permiten campos distintos de title, description, category, startDate, endDate, modality, location, capacity, imageUrl, status e isActive"
    }
  )
]

router.put(
  "/:id",
  authorizeRoles("admin", "organizer"),
  eventUpdateValidators,
  validateRequest,
  updateEventById
)

router.patch(
  "/:id",
  authorizeRoles("admin", "organizer"),
  eventUpdateValidators,
  validateRequest,
  updateEventById
)

router.delete(
  "/:id",
  authorizeRoles("admin"),
  deleteEventById
)

export default router
