import Registration from "../models/Registration.js"
import Event from "../models/Event.js"
import AppError from "../utils/AppError.js"

const formatRegistration = (registration) => {
  return {
    id: registration._id,
    user: registration.user,
    event: registration.event,
    status: registration.status,
    registeredAt: registration.registeredAt,
    cancelledAt: registration.cancelledAt,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt
  }
}

const assertEventAvailable = (event) => {
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
      "El evento no está disponible para inscripciones",
      400
    )
  }

  if (event.startDate <= new Date()) {
    throw new AppError(
      "No podés inscribirte en un evento que ya inició",
      400
    )
  }
}

const assertCapacityAvailable = async (event) => {
  const registeredCount =
    await Registration.countDocuments({
      event: event._id,
      status: "registered"
    })

  if (registeredCount >= event.capacity) {
    throw new AppError(
      "El evento alcanzó su capacidad máxima",
      409
    )
  }
}

const registerToEvent = async (
  userId,
  eventId
) => {
  const event = await Event.findById(eventId)

  assertEventAvailable(event)

  const existingRegistration =
    await Registration.findOne({
      user: userId,
      event: eventId
    })

  if (
    existingRegistration &&
    existingRegistration.status === "registered"
  ) {
    throw new AppError(
      "Ya estás inscrito en este evento",
      409
    )
  }

  await assertCapacityAvailable(event)

  if (
    existingRegistration &&
    existingRegistration.status === "cancelled"
  ) {
    existingRegistration.status = "registered"
    existingRegistration.registeredAt = new Date()
    existingRegistration.cancelledAt = null

    await existingRegistration.save()

    return formatRegistration(
      existingRegistration
    )
  }

  const registration =
    await Registration.create({
      user: userId,
      event: eventId
    })

  return formatRegistration(registration)
}

const cancelRegistration = async (
  userId,
  eventId
) => {
  const registration =
    await Registration.findOne({
      user: userId,
      event: eventId
    })

  if (!registration) {
    throw new AppError(
      "No estás inscrito en este evento",
      404
    )
  }

  if (registration.status === "cancelled") {
    throw new AppError(
      "La inscripción ya se encuentra cancelada",
      409
    )
  }

  registration.status = "cancelled"
  registration.cancelledAt = new Date()

  await registration.save()

  return formatRegistration(registration)
}

const getUserRegistrations = async (
  userId
) => {
  const registrations =
    await Registration.find({
      user: userId
    })
      .populate({
        path: "event",
        select:
          "title description category organizer startDate endDate modality location capacity imageUrl status isActive"
      })
      .sort({
        registeredAt: -1
      })

  return registrations.map(
    formatRegistration
  )
}

export {
  registerToEvent,
  cancelRegistration,
  getUserRegistrations
}

const getEventRegistrations = async (
  eventId,
  requestingUser,
  statusFilter
) => {
  const event = await Event.findById(eventId)

  if (!event) {
    throw new AppError(
      "El evento no existe",
      404
    )
  }

  if (
    requestingUser.role === "organizer" &&
    event.organizer.toString() !==
      requestingUser._id.toString()
  ) {
    throw new AppError(
      "No podés consultar los participantes de actividades de otro organizador",
      403
    )
  }

  const query = {
    event: eventId
  }

  if (statusFilter) {
    query.status = statusFilter
  }

  const registrations = await Registration.find(
    query
  )
    .populate({
      path: "user",
      select: "firstName lastName email"
    })
    .sort({
      registeredAt: -1
    })

  return registrations.map(
    formatRegistration
  )
}

export {
  getEventRegistrations
}