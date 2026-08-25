import Notification from "../models/Notification.js"
import AppError from "../utils/AppError.js"

const formatNotification = (notification) => {
  return {
    id: notification._id,
    recipient: notification.recipient,
    event: notification.event,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt
  }
}

const getUserNotifications = async (
  userId
) => {
  const notifications =
    await Notification.find({
      recipient: userId
    })
      .populate({
        path: "event",
        select:
          "title description startDate endDate modality location imageUrl status isActive"
      })
      .sort({
        createdAt: -1
      })

  return notifications.map(
    formatNotification
  )
}

const markNotificationAsRead = async (
  userId,
  notificationId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId
    })

  if (!notification) {
    throw new AppError(
      "La notificación no existe",
      404
    )
  }

  if (!notification.isRead) {
    notification.isRead = true
    notification.readAt = new Date()

    await notification.save()
  }

  return formatNotification(notification)
}

export {
  getUserNotifications,
  markNotificationAsRead
}