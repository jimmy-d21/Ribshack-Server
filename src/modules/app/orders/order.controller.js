import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./order.service.js";
import * as adminService from "../../admin/analytics/analytics.service.js";
import * as storeService from "../../store/dashboard/dashboard.service.js";
import * as storeBranchService from "../../admin/branches/branches.service.js";

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
      adminService.getKPIS(),
      adminService.getRegionalRevenue(),
      adminService.getWeeklyRevenue(),
      adminService.getSalesByCategory(),
      adminService.getMonthlyRevenue(),
      adminService.getTopBranches(),
      adminService.getProductBestSeller(),
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

async function broadcastStoreDashboard(io, branchId) {
  try {
    const [
      kpis,
      weeklyRevenue,
      hourlyRevenue,
      categorySales,
      bestsellerOfTheDay,
    ] = await Promise.all([
      storeService.getKPIS(branchId),
      storeService.getWeeklyRevenue(branchId),
      storeService.getHourlyRevenue(branchId),
      storeService.getCategorySales(branchId),
      storeService.getBestSeller(branchId),
    ]);

    io.to(`branch:${branchId}`).emit("storeDashboard:update", {
      kpis,
      weeklyRevenue,
      hourlyRevenue,
      categorySales,
      bestsellerOfTheDay,
    });
  } catch (err) {
    console.error("Failed to broadcast store dashboard:", err.message);
  }
}

async function broadcastAdminBranchDetails(io, branchId) {
  try {
    const analytics = await storeBranchService.getBranchAnalytics(branchId);
    const roomId = `branch:${branchId}`;
    io.to(roomId).emit("adminBranchDetails:update", analytics);
  } catch (err) {
    console.error("Failed to broadcast admin branch details:", err.message);
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
  const { newOrder, newNotifications } = await service.createOrder(
    userId,
    req.body,
  );

  broadcastAdminAnalytics(io);
  broadcastStoreDashboard(io, req.body.branchId);
  broadcastAdminBranchDetails(io, req.body.branchId);

  io.to(`branch:${req.body.branchId}`).emit("order:created", {
    id: newOrder.id,
    orderNumber: newOrder.orderNumber,
    customerName: newOrder.customerName,
    status: newOrder.status,
    specialInstructions: newOrder.specialInstructions ?? null,
    totalAmount: parseFloat(newOrder.totalAmount),
    paymentMethod: newOrder.paymentMethod,
    placedAt: newOrder.placedAt,
    fullAddress: newOrder.fullAddress,
    items: newOrder.items ?? [],
  });

  io.to(`branch:${req.body.branchId}`).emit(
    "branch:notification",
    newNotifications,
  );

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
