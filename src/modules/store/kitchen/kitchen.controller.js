import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./kitchen.service.js";

export const getOrders = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const kitchenOrders = await service.getOrders(branchId);
  return res.status(200).json({ success: true, kitchenOrders });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const branchId = req.authUser.id;
  const orderDetails = await service.getOrderDetails(orderId, branchId);
  return res.status(200).json({ success: true, orderDetails });
});
