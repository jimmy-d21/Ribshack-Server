import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./product.service.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await service.getAllProducts();
  return res.status(200).json({ success: true, products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await service.createProduct(req.body);
  return res
    .status(201)
    .json({ success: true, message: "Product created successfully", product });
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await service.getProductDetails(productId);
  return res.status(200).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updatedProduct = await service.updateProduct(productId, req.body);
  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    updatedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await service.deleteProduct(productId);

  return res
    .status(200)
    .json({ success: true, message: `${product.name} removed from catalog` });
});

export const updateAvailability = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updatedProduct = await service.updateAvailability(productId);
  return res.status(200).json({
    success: true,
    message: `${updatedProduct.name} availability updated`,
    updatedProduct,
  });
});
