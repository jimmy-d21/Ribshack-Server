import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./home.service.js";

export const getBestSellingMenu = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const bestSellingMenu = await service.getBestSellingMenu(branchId);
  return res.status(200).json({ success: true, bestSellingMenu });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const categories = await service.getAllCategories(branchId);
  return res.status(200).json({ success: true, categories });
});
