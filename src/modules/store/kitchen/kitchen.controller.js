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

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const { orderId } = req.params;

  const branchId = req.authUser.id;
  const updatedOrder = await service.updateOrderStatus(orderId, branchId, io);

  io.to(`user:${updatedOrder.customerId}`).emit(
    "order:statusChanged",
    updatedOrder,
  );

  return res.status(200).json({ success: true, updatedOrder });
});
