import {
  registerToEvent,
  cancelRegistration,
  getUserRegistrations
} from "../services/registrationService.js"

const registerEvent = async (
  req,
  res,
  next
) => {
  try {
    const registration =
      await registerToEvent(
        req.user._id,
        req.params.id
      )

    res.status(201).json({
      success: true,
      message: "Inscripción realizada correctamente",
      data: {
        registration
      }
    })
  } catch (error) {
    next(error)
  }
}

const cancelEventRegistration = async (
  req,
  res,
  next
) => {
  try {
    const registration =
      await cancelRegistration(
        req.user._id,
        req.params.id
      )

    res.status(200).json({
      success: true,
      message: "Inscripción cancelada correctamente",
      data: {
        registration
      }
    })
  } catch (error) {
    next(error)
  }
}

const getMyRegistrations = async (
  req,
  res,
  next
) => {
  try {
    const registrations =
      await getUserRegistrations(
        req.user._id
      )

    res.status(200).json({
      success: true,
      message: "Inscripciones obtenidas correctamente",
      data: {
        registrations
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  registerEvent,
  cancelEventRegistration,
  getMyRegistrations
}