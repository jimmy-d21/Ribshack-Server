import { appProductModel as model } from "./product.model.js";

export const getProductDetails = async (productId) => {
  const product = await model.findDetailsById(productId);
  if (!product) throw new Error("Product not found");
  return product;
};
