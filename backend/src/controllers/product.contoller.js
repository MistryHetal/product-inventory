import categoryModel from "../models/category.model.js";
import Product from "../models/product.model.js";

/**
 * @desc Create Product
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;

    // Validation
    if (!name || !description || quantity === undefined) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All required fields must be provided",
      });
    }

    const existing = await Product.findOne({ name, isDeleted: false });

    if (existing) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Product name already exists",
      });
    }

    // Validate categories before creating product
    if (categories && categories.length > 0) {
      const validCategories = await categoryModel
        .find({
          _id: { $in: categories },
          isDeleted: false,
        })
        .select("_id");

      const validCategoryIds = validCategories.map((cat) => cat._id.toString());

      const invalidCategories = categories.filter(
        (id) => !validCategoryIds.includes(id.toString()),
      );

      if (invalidCategories.length > 0) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: `Invalid category ID(s): ${invalidCategories.join(", ")}`,
        });
      }
    }

    const product = await Product.create({
      name,
      description,
      quantity,
      categories,
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc Get Products (Pagination + Filter)
 */
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", categories } = req.query;

    const query = { isDeleted: false };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (categories) {
      query.categories = { $in: categories.split(",") };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("categories")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Products fetched successfully",
      data: products,
      pagination: {
        totalRecords: total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        pageSize: Number(limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

/**
 * @desc Get Single Product By ID
 */
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log("Fetching Product with ID:", productId);
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("categories");
    console.log("Fetched Product:", product);

    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

/**
 * @desc Update Product
 */
/**
 * @desc Update Product (Also handles Soft Delete)
 */
const updateProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories, isDeleted } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Product not found",
      });
    }

    // If already deleted and trying to update (optional rule)
    if (product.isDeleted && isDeleted !== false) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Cannot update a deleted product",
      });
    }

    // Check duplicate name
    if (name && name !== product.name) {
      const duplicate = await Product.findOne({
        name,
        isDeleted: false,
        _id: { $ne: req.params.id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: "Another product with this name already exists",
        });
      }
    }

    if (categories) {
      const validCategories = await categoryModel
        .find({
          _id: { $in: categories },
          isDeleted: false,
        })
        .select("_id");

      const validCategoryIds = validCategories.map((cat) => cat._id.toString());

      const invalidCategories = categories.filter(
        (id) => !validCategoryIds.includes(id.toString()),
      );

      if (invalidCategories.length > 0) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: `Category not found: ${invalidCategories.join(", ")}`,
        });
      }

      product.categories = categories;
    }

    // Update fields only if provided
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.quantity = quantity ?? product.quantity;

    // Soft delete or restore
    if (typeof isDeleted === "boolean") {
      product.isDeleted = isDeleted;
    }

    await product.save();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: isDeleted
        ? "Product deleted successfully"
        : "Product updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
};
