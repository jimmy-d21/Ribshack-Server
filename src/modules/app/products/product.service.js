import { appProductModel as model } from "./product.model.js";

export const getProductDetails = async (productId) => {
  const product = await model.findDetailsById(productId);
  if (!product) throw new Error("Product not found");
  return product;
};

export const getProductAddons = async (productId) => {
  const product = await model.findById(productId);
  if (!product) throw new Error("Product not found");

  const addons = await model.findAddonsByProductId(product.id);
  return addons;
};
