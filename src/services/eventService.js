import Event from "../models/Event.js"
import Category from "../models/Category.js"
import AppError from "../utils/AppError.js"

const formatEvent = (event) => {
  return {
    id: event._id,
    title: event.title,
    description: event.description,
    category: event.category,
    organizer: event.organizer,
    startDate: event.startDate,
    endDate: event.endDate,
    modality: event.modality,
    location: event.location,
    capacity: event.capacity,
    imageUrl: event.imageUrl,
    status: event.status,
    isActive: event.isActive,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt
  }
}

const assertCategoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId)

  if (!category) {
    throw new AppError(
      "La categoría no existe",
      404
    )
  }
}

const assertStartDateNotPast = (startDate) => {
  if (new Date(startDate) < new Date()) {
    throw new AppError(
      "La fecha de inicio no puede ser anterior a la fecha actual",
      400
    )
  }
}

const isOwner = (
  event,
  requestingUser
) => {
  return event.organizer.toString() === requestingUser._id.toString()
}

const createEvent = async (
  requestingUser,
  {
    title,
    description,
    category,
    startDate,
    endDate,
    modality,
    location,
    capacity,
    imageUrl,
    status
  }
) => {
  await assertCategoryExists(category)
  assertStartDateNotPast(startDate)

  const event = new Event({
    title,
    description,
    category,
    organizer: requestingUser._id,
    startDate,
    endDate,
    modality,
    location,
    capacity,
    imageUrl,
    status
  })

  await event.save()

  return formatEvent(event)
}

const getEvents = async (
  requestingUser,
  page,
  limit,
  mine
) => {
  const currentPage = page > 0 ? page : 1
  const pageSize = limit > 0 ? limit : 20

  let filter = {}

  if (mine) {
    filter = {
      organizer: requestingUser._id
    }
  } else if (requestingUser.role !== "admin") {
    filter = {
      status: "published",
      isActive: true
    }
  }

  const [
    events,
    totalEvents
  ] = await Promise.all([
    Event.find(filter)
      .sort({
        createdAt: -1
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Event.countDocuments(filter)
  ])

  return {
    events: events.map(formatEvent),
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalEvents,
      totalPages: Math.ceil(totalEvents / pageSize)
    }
  }
}

const getEventById = async (
  eventId,
  requestingUser
) => {
  const event = await Event.findById(eventId)

  if (!event) {
    throw new AppError(
      "El evento no existe",
      404
    )
  }

  const isPubliclyVisible =
    event.status === "published" &&
    event.isActive === true

  const isAdmin = requestingUser.role === "admin"

  if (
    !isPubliclyVisible &&
    !isAdmin &&
    !isOwner(event, requestingUser)
  ) {
    throw new AppError(
      "El evento no existe",
      404
    )
  }

  return formatEvent(event)
}

const updateEvent = async (
  eventId,
  requestingUser,
  updates
) => {
  const event = await Event.findById(eventId)

  if (!event) {
    throw new AppError(
      "El evento no existe",
      404
    )
  }

  const isAdmin = requestingUser.role === "admin"

  if (!isAdmin && !isOwner(event, requestingUser)) {
    throw new AppError(
      "No podés modificar actividades de otro organizador",
      403
    )
  }

  const {
    title,
    description,
    category,
    startDate,
    endDate,
    modality,
    location,
    capacity,
    imageUrl,
    status,
    isActive
  } = updates

  if (isActive !== undefined && !isAdmin) {
    throw new AppError(
      "Solo un administrador puede activar o desactivar un evento",
      403
    )
  }

  if (category !== undefined) {
    await assertCategoryExists(category)
    event.category = category
  }

  if (startDate !== undefined) {
    assertStartDateNotPast(startDate)
    event.startDate = startDate
  }

  if (endDate !== undefined) {
    event.endDate = endDate
  }

  if (title !== undefined) {
    event.title = title
  }

  if (description !== undefined) {
    event.description = description
  }

  if (modality !== undefined) {
    event.modality = modality
  }

  if (location !== undefined) {
    event.location = location
  }

  if (capacity !== undefined) {
    event.capacity = capacity
  }

  if (imageUrl !== undefined) {
    event.imageUrl = imageUrl
  }

  if (status !== undefined) {
    event.status = status
  }

  if (isActive !== undefined) {
    event.isActive = isActive
  }

  await event.save()

  return formatEvent(event)
}

const deactivateEvent = async (
  eventId,
  requestingUser
) => {
  return updateEvent(
    eventId,
    requestingUser,
    {
      isActive: false
    }
  )
}

export {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deactivateEvent
}
