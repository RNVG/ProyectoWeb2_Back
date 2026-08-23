import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory
} from "../services/categoryService.js"

const listCategories = async (
  req,
  res,
  next
) => {
  try {
    const page = parseInt(req.query.page, 10)
    const limit = parseInt(req.query.limit, 10)

    const includeInactive =
      req.query.includeInactive === "true" &&
      req.user.role === "admin"

    const result = await getCategories(
      page,
      limit,
      includeInactive
    )

    res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getCategory = async (
  req,
  res,
  next
) => {
  try {
    const category = await getCategoryById(
      req.params.id,
      req.user.role === "admin"
    )

    res.status(200).json({
      success: true,
      data: {
        category
      }
    })
  } catch (error) {
    next(error)
  }
}

const createCategoryHandler = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description
    } = req.body

    const category = await createCategory({
      name,
      description
    })

    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      data: {
        category
      }
    })
  } catch (error) {
    next(error)
  }
}

const updateCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
      isActive
    } = req.body

    const category = await updateCategory(
      req.params.id,
      {
        name,
        description,
        isActive
      }
    )

    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      data: {
        category
      }
    })
  } catch (error) {
    next(error)
  }
}

const deleteCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const category = await deactivateCategory(
      req.params.id
    )

    res.status(200).json({
      success: true,
      message: "Categoría desactivada correctamente",
      data: {
        category
      }
    })
  } catch (error) {
    next(error)
  }
}

export {
  listCategories,
  getCategory,
  createCategoryHandler,
  updateCategoryById,
  deleteCategoryById
}
