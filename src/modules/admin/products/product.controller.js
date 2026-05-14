import { AdminProductServices as service } from "./product.service.js";

export const AdminProductController = {
  getAllProducts: async (req, res) => {
    const products = await service.getAllProducts();

    return res.status(200).json({ success: true, products });
  },
};
