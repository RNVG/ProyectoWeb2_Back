import Category from "../models/Category.js"
import AppError from "../utils/AppError.js"

const formatCategory = (category) => {
  return {
    id: category._id,
    name: category.name,
    description: category.description,
    slug: category.slug,
    isActive: category.isActive,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt
  }
}

const getCategories = async (
  page,
  limit,
  includeInactive
) => {
  const currentPage = page > 0 ? page : 1
  const pageSize = limit > 0 ? limit : 20

  const filter = includeInactive
    ? {}
    : {
        isActive: true
      }

  const [
    categories,
    totalCategories
  ] = await Promise.all([
    Category.find(filter)
      .sort({
        createdAt: -1
      })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize),
    Category.countDocuments(filter)
  ])

  return {
    categories: categories.map(formatCategory),
    pagination: {
      page: currentPage,
      limit: pageSize,
      totalCategories,
      totalPages: Math.ceil(totalCategories / pageSize)
    }
  }
}

const getCategoryById = async (
  categoryId,
  isAdmin
) => {
  const category = await Category.findById(categoryId)

  if (!category || (!category.isActive && !isAdmin)) {
    throw new AppError(
      "La categoría no existe",
      404
    )
  }

  return formatCategory(category)
}

const createCategory = async ({
  name,
  description
}) => {
  const category = new Category({
    name,
    description
  })

  await category.save()

  return formatCategory(category)
}

const updateCategory = async (
  categoryId,
  updates
) => {
  const category = await Category.findById(categoryId)

  if (!category) {
    throw new AppError(
      "La categoría no existe",
      404
    )
  }

  const {
    name,
    description,
    isActive
  } = updates

  if (name !== undefined) {
    const existingCategory = await Category.findOne({
      name,
      _id: {
        $ne: categoryId
      }
    })

    if (existingCategory) {
      throw new AppError(
        "Ya existe una categoría con ese nombre",
        409
      )
    }

    category.name = name
  }

  if (description !== undefined) {
    category.description = description
  }

  if (isActive !== undefined) {
    category.isActive = isActive
  }

  await category.save()

  return formatCategory(category)
}

const deactivateCategory = async (categoryId) => {
  return updateCategory(
    categoryId,
    {
      isActive: false
    }
  )
}

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deactivateCategory
}
