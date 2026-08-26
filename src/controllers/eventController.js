import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deactivateEvent
} from "../services/eventService.js"

const listEvents = async (
  req,
  res,
  next
) => {
  try {
    const page = parseInt(req.query.page, 10)
    const limit = parseInt(req.query.limit, 10)
    const mine = req.query.mine === "true"

    const {
      category,
      date,
      location,
      organizer
    } = req.query

    const search = req.query.search || req.query.q

    const available =
      req.query.available === undefined
        ? undefined
        : req.query.available === "true"

    const result = await getEvents(
      req.user,
      page,
      limit,
      mine,
      {
        category,
        date,
        location,
        organizer,
        available,
        search
      }
    )

    res.status(200).json({
      success: true,
      message: "Eventos obtenidos correctamente",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getEvent = async (
  req,
  res,
  next
) => {
  try {
    const event = await getEventById(
      req.params.id,
      req.user
    )

    res.status(200).json({
      success: true,
      data: {
        event
      }
    })
  } catch (error) {
    next(error)
  }
}

const createEventHandler = async (
  req,
  res,
  next
) => {
  try {
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
      status
    } = req.body

    const event = await createEvent(
      req.user,
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
    )

    res.status(201).json({
      success: true,
      message: "Evento creado correctamente",
      data: {
        event
      }
    })
  } catch (error) {
    next(error)
  }
}

const updateEventById = async (
  req,
  res,
  next
) => {
  try {
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
    } = req.body

    const event = await updateEvent(
      req.params.id,
      req.user,
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
        status,
        isActive
      }
    )

    res.status(200).json({
      success: true,
      message: "Evento actualizado correctamente",
      data: {
        event
      }
    })
  } catch (error) {
    next(error)
  }
}

const deleteEventById = async (
  req,
  res,
  next
) => {
  try {
    const event = await deactivateEvent(
      req.params.id,
      req.user
    )

    res.status(200).json({
      success: true,
      message: "Evento desactivado correctamente",
      data: {
        event
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  listEvents,
  getEvent,
  createEventHandler,
  updateEventById,
  deleteEventById
}
