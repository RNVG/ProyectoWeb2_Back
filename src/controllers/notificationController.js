import {
  getUserNotifications,
  markNotificationAsRead
} from "../services/notificationService.js"

const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await getUserNotifications(
        req.user._id
      )

    res.status(200).json({
      success: true,
      message: "Notificaciones obtenidas correctamente",
      data: {
        notifications
      }
    })
  } catch (error) {
    next(error)
  }
}

const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await markNotificationAsRead(
        req.user._id,
        req.params.id
      )

    res.status(200).json({
      success: true,
      message: "Notificación marcada como leída",
      data: {
        notification
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  getMyNotifications,
  markAsRead
}