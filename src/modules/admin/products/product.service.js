import { adminProductModel as model } from "./product.model.js";

export const AdminProductServices = {
  getAllProducts: async () => {
    return await model.findAll();
  },
};
