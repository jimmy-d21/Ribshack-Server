import { AdminProductServices as service } from "./product.service.js";

export const AdminProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await service.getAllProducts();

      return res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  createProduct: async (req, res) => {
    try {
      const product = await service.createProduct(req.body);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  getProductDetails: async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await service.getProductDetails(productId);

      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  },
};
