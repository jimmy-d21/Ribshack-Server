import AppError from "../../../utils/AppError.js";
import { appProductModel as model } from "./product.model.js";

export const getProductDetails = async (productId) => {
  const product = await model.findDetailsById(productId);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const getProductAddons = async (productId) => {
  const product = await model.findById(productId);
  if (!product) throw new AppError("Product not found", 404);
  return model.findAddonsByProductId(product.id);
};
