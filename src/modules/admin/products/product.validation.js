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
};
