import {
  addFavorite,
  removeFavorite,
  getUserFavorites
} from "../services/favoriteService.js"

const addEventToFavorites = async (
  req,
  res,
  next
) => {
  try {
    const favorite = await addFavorite(
      req.user._id,
      req.params.id
    )

    res.status(201).json({
      success: true,
      message: "Evento agregado a favoritos correctamente",
      data: {
        favorite
      }
    })
  } catch (error) {
    next(error)
  }
}

const removeEventFromFavorites = async (
  req,
  res,
  next
) => {
  try {
    const favorite = await removeFavorite(
      req.user._id,
      req.params.id
    )

    res.status(200).json({
      success: true,
      message: "Evento eliminado de favoritos correctamente",
      data: {
        favorite
      }
    })
  } catch (error) {
    next(error)
  }
}

const getMyFavorites = async (
  req,
  res,
  next
) => {
  try {
    const favorites = await getUserFavorites(
      req.user._id
    )

    res.status(200).json({
      success: true,
      message: "Favoritos obtenidos correctamente",
      data: {
        favorites
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  addEventToFavorites,
  removeEventFromFavorites,
  getMyFavorites
}