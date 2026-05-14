export const AdminProductValidation = {
  createProduct: (req, res, next) => {
    const { name, category, price, description, unliRice, available, image } =
      req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      !description ||
      unliRice === undefined ||
      available === undefined ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    next();
  },

  getProductDetails: (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (isNaN(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    next();
  },

  updateProduct: (req, res, next) => {
    const { name, category, price, description, unliRice, available, image } =
      req.body;
    if (
      !name ||
      !category ||
      price === undefined ||
      !description ||
      unliRice === undefined ||
      available === undefined ||
      !image
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!name.trim() || !category.trim() || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty or whitespace",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid price",
      });
    }

    next();
  },
};
