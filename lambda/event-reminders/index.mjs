import mongoose from "mongoose"

let isConnected = false

const connectDB = async () => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI)
    isConnected = true
  }
}

export const handler = async () => {
  try {
    await connectDB()

    const db = mongoose.connection.db

    const eventsCollection = db.collection("events")
    const registrationsCollection = db.collection("registrations")
    const notificationsCollection = db.collection("notifications")

    const now = new Date()
    const next24Hours = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    )

    const upcomingEvents = await eventsCollection
      .find({
        status: "published",
        isActive: true,
        startDate: {
          $gt: now,
          $lte: next24Hours
        }
      })
      .toArray()

    let notificationsCreated = 0

    for (const event of upcomingEvents) {
      const registrations = await registrationsCollection
        .find({
          event: event._id,
          status: "registered"
        })
        .toArray()

      for (const registration of registrations) {
        const existingNotification =
          await notificationsCollection.findOne({
            recipient: registration.user,
            event: event._id,
            type: "event-reminder"
          })

        if (!existingNotification) {
          const currentDate = new Date()

          await notificationsCollection.insertOne({
            recipient: registration.user,
            event: event._id,
            type: "event-reminder",
            title: "Recordatorio de actividad",
            message: `La actividad "${event.title}" comienza dentro de las próximas 24 horas.`,
            isRead: false,
            readAt: null,
            createdAt: currentDate,
            updatedAt: currentDate
          })

          notificationsCreated++
        }
      }
    }

    console.log(
      `Eventos próximos encontrados: ${upcomingEvents.length}`
    )

    console.log(
      `Notificaciones creadas: ${notificationsCreated}`
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        eventsFound: upcomingEvents.length,
        notificationsCreated
      })
    }
  } catch (error) {
    console.error(
      "Error ejecutando Lambda de recordatorios:",
      error
    )

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message:
          "Error al procesar los recordatorios"
      })
    }
  }
}