import Category from "../models/category.model.js";

/**
 * Create Category
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({ name, isDeleted: false });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({ name });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Get Categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isDeleted: false }).lean();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Get Single Category By ID
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * Update Category
 */
const updateCategory = async (req, res) => {
  try {
    const { name, isDeleted } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Prevent duplicate name
    if (name && name !== category.name) {
      const duplicate = await Category.findOne({
        name,
        _id: { $ne: req.params.id },
        isDeleted: false,
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    // Update fields dynamically
    if (name !== undefined) category.name = name;
    if (isDeleted !== undefined) category.isDeleted = isDeleted;

    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};
