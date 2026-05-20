import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./menu.service.js";

export const getAllMenu = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const productMenus = await service.getAllMenu(branchId);
  return res.status(200).json({ success: true, productMenus });
});

export const getMenuDetails = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await service.getMenuDetails(productId);
  return res.status(200).json({ success: true, product });
});

export const updateMenuStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const branchId = req.authUser.id;
  const updatedMenu = await service.updateMenuStatus(productId, branchId);
  return res.status(200).json({
    success: true,
    message: "Menu item status updated successfully",
    updatedMenu,
  });
});
