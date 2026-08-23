import User from "../models/User.js"
import AppError from "../utils/AppError.js"

const formatUser = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    role: user.role,
    isActive: user.isActive,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const hasAnotherActiveAdmin = async (excludedUserId) => {
  const anotherActiveAdmin = await User.findOne({
    _id: {
      $ne: excludedUserId
    },
    role: "admin",
    isActive: true
  })

  return Boolean(anotherActiveAdmin)
}

const getUsers = async (
  page,
  limit
) => {
  const currentPage = page > 0 ? page : 1
  const pageSize = limit > 0 ? limit : 20

  const [
    users,
    totalUsers
  ] = await Promise.all([
    User.find()
      .sort({
        createdAt: -1
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    User.countDocuments()
  ])

  return {
    users: users.map(formatUser),
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalUsers,
      totalPages: Math.ceil(totalUsers / pageSize)
    }
  }
}

const getUserById = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new AppError(
      "El usuario no existe",
      404
    )
  }

  return formatUser(user)
}

const updateUser = async (
  targetUserId,
  requestingUser,
  updates
) => {
  const user = await User.findById(targetUserId)

  if (!user) {
    throw new AppError(
      "El usuario no existe",
      404
    )
  }

  const {
    firstName,
    lastName,
    email,
    password,
    role,
    isActive
  } = updates

  const isSelfEdit =
    requestingUser._id.toString() === targetUserId.toString()

  const isRemovingAdminRole =
    role !== undefined &&
    role !== "admin" &&
    user.role === "admin"

  const isDeactivating =
    isActive === false &&
    user.isActive === true

  if (
    isSelfEdit &&
    user.role === "admin" &&
    (isRemovingAdminRole || isDeactivating)
  ) {
    const canSelfEdit = await hasAnotherActiveAdmin(
      user._id
    )

    if (!canSelfEdit) {
      throw new AppError(
        "No puedes quitarte el rol admin ni desactivar tu cuenta porque sos el único administrador activo",
        400
      )
    }
  }

  if (email !== undefined) {
    const normalizedEmail = email
      .trim()
      .toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: {
        $ne: targetUserId
      }
    })

    if (existingUser) {
      throw new AppError(
        "El correo electrónico ya está registrado por otro usuario",
        409
      )
    }

    user.email = normalizedEmail
  }

  if (firstName !== undefined) {
    user.firstName = firstName
  }

  if (lastName !== undefined) {
    user.lastName = lastName
  }

  if (password !== undefined) {
    user.password = password
  }

  if (role !== undefined) {
    user.role = role
  }

  if (isActive !== undefined) {
    user.isActive = isActive
  }

  await user.save()

  return formatUser(user)
}

const deactivateUser = async (
  targetUserId,
  requestingUser
) => {
  return updateUser(
    targetUserId,
    requestingUser,
    {
      isActive: false
    }
  )
}

export {
  getUsers,
  getUserById,
  updateUser,
  deactivateUser
}
