import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./order.service.js";
import {
  getKPIS,
  getRegionalRevenue,
  getWeeklyRevenue,
  getSalesByCategory,
  getMonthlyRevenue,
  getTopBranches,
  getProductBestSeller,
} from "../../admin/analytics/analytics.service.js";

async function broadcastAdminAnalytics(io) {
  try {
    const [
      kpis,
      regionPerformance,
      weeklyRevenue,
      salesByCategory,
      monthlyRevenue,
      topBranches,
      bestsellers,
    ] = await Promise.all([
      getKPIS(),
      getRegionalRevenue(),
      getWeeklyRevenue(),
      getSalesByCategory(),
      getMonthlyRevenue(),
      getTopBranches(),
      getProductBestSeller(),
    ]);

    io.emit("adminAnalytics:update", {
      kpis,
      regionPerformance,
      weeklyRevenue,
      salesByCategory,
      monthlyRevenue,
      topBranches,
      bestsellers,
    });
  } catch (err) {
    console.error("Failed to broadcast admin analytics:", err.message);
  }
}

export const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const orders = await service.getAllOrders(userId);
  return res.status(200).json({ success: true, orders });
});

export const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.authUser.id;
  const order = await service.getOrderDetails(orderId, userId);
  return res.status(200).json({ success: true, order });
});

export const createOrder = asyncHandler(async (req, res) => {
  const io = req.app.get("io");
  const userId = req.authUser.id;
  const newOrder = await service.createOrder(userId, req.body);

  broadcastAdminAnalytics(io);

  return res
    .status(201)
    .json({ success: true, message: "Order placed! Salamat!", newOrder });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.authUser.id;
  await service.deleteOrder(orderId, userId);
  return res
    .status(200)
    .json({ success: true, message: "Order cancelled successfully" });
});
