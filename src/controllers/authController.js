import {
  registerUser,
  loginUser
} from "../services/authService.js"

const register = async (req, res, next) => {
  try {
    const result = await registerUser(
      req.body
    )

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body

    const result = await loginUser(
      email,
      password
    )

    res.status(200).json({
      success: true,
      message: "Inicio de sesión realizado correctamente",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    const user = req.user

    res.status(200).json({
      success: true,
      data: {
        user: {
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
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (
  req,
  res,
  next
) => {
  try {
    res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente"
    })
  } catch (error) {
    next(error)
  }
}

export {
  register,
  login,
  getCurrentUser,
  logout
}