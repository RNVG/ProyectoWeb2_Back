import Favorite from "../models/Favorite.js"
import Event from "../models/Event.js"
import AppError from "../utils/AppError.js"

const formatFavorite = (favorite) => {
  return {
    id: favorite._id,
    user: favorite.user,
    event: favorite.event,
    createdAt: favorite.createdAt,
    updatedAt: favorite.updatedAt
  }
}

const addFavorite = async (
  userId,
  eventId
) => {
  const event = await Event.findById(eventId)

  if (!event) {
    throw new AppError(
      "El evento no existe",
      404
    )
  }

  if (
    event.status !== "published" ||
    event.isActive !== true
  ) {
    throw new AppError(
      "El evento no está disponible",
      400
    )
  }

  const existingFavorite =
    await Favorite.findOne({
      user: userId,
      event: eventId
    })

  if (existingFavorite) {
    throw new AppError(
      "El evento ya está en favoritos",
      409
    )
  }

  const favorite = await Favorite.create({
    user: userId,
    event: eventId
  })

  return formatFavorite(favorite)
}

const removeFavorite = async (
  userId,
  eventId
) => {
  const favorite =
    await Favorite.findOneAndDelete({
      user: userId,
      event: eventId
    })

  if (!favorite) {
    throw new AppError(
      "El evento no se encuentra en favoritos",
      404
    )
  }

  return formatFavorite(favorite)
}

const getUserFavorites = async (
  userId
) => {
  const favorites = await Favorite.find({
    user: userId
  })
    .populate({
      path: "event",
      select:
        "title description category organizer startDate endDate modality location capacity imageUrl status isActive"
    })
    .sort({
      createdAt: -1
    })

  return favorites.map(formatFavorite)
}

export {
  addFavorite,
  removeFavorite,
  getUserFavorites
}