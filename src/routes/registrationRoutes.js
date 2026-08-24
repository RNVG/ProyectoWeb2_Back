import express from "express"
import {
  registerEvent,
  cancelEventRegistration,
  getMyRegistrations
} from "../controllers/registrationController.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)

router.post(
  "/events/:id/register",
  registerEvent
)

router.delete(
  "/events/:id/register",
  cancelEventRegistration
)

router.get(
  "/users/me/registrations",
  getMyRegistrations
)

export default router