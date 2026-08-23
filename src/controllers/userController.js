import {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser
} from "../services/userService.js"

const listUsers = async (
  req,
  res,
  next
) => {
  try {
    const page = parseInt(req.query.page, 10)
    const limit = parseInt(req.query.limit, 10)

    const result = await getUsers(
      page,
      limit
    )

    res.status(200).json({
      success: true,
      message: "Usuarios obtenidos correctamente",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getUser = async (
  req,
  res,
  next
) => {
  try {
    const user = await getUserById(
      req.params.id
    )

    res.status(200).json({
      success: true,
      data: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}

const updateUserById = async (
  req,
  res,
  next
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      isActive
    } = req.body

    const user = await updateUser(
      req.params.id,
      req.user,
      {
        firstName,
        lastName,
        email,
        password,
        role,
        isActive
      }
    )

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
      data: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}

const deleteUserById = async (
  req,
  res,
  next
) => {
  try {
    const user = await deactivateUser(
      req.params.id,
      req.user
    )

    res.status(200).json({
      success: true,
      message: "Usuario desactivado correctamente",
      data: {
        user
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  listUsers,
  getUser,
  updateUserById,
  deleteUserById
}
