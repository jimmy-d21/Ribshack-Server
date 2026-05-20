import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./product.service.js";

export const getProductDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await service.getProductDetails(productId);
  return res.status(200).json({ success: true, product });
});

export const getProductAddons = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const addons = await service.getProductAddons(productId);
  return res.status(200).json({ success: true, addons });
});
