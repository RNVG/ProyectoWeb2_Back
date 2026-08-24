import express from "express"

import {
  addEventToFavorites,
  removeEventFromFavorites,
  getMyFavorites
} from "../controllers/favoriteController.js"

import protect from "../middleware/authMiddleware.js"

const router = express.Router()

router.use(protect)

router.post(
  "/events/:id/favorite",
  addEventToFavorites
)

router.delete(
  "/events/:id/favorite",
  removeEventFromFavorites
)

router.get(
  "/users/me/favorites",
  getMyFavorites
)

export default router