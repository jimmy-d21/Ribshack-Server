import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./inventoryRequest.service.js";
import {
  getRequestKPIS,
  getAllInventory,
} from "../../store/inventory/inventory.service.js";

async function broadcastStoreInventory(io, branchId) {
  try {
    const [kpis, inventory] = await Promise.all([
      getRequestKPIS(branchId),
      getAllInventory(branchId),
    ]);

    io.to(`branch:${branchId}`).emit("inventory:update", { kpis, inventory });
  } catch (err) {
    console.error("Failed to broadcast store inventory:", err.message);
  }
}

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const inventoryRequests = await service.getAllRequests(status);
  return res.status(200).json({ success: true, inventoryRequests });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const io = req.app.get("io");

  const { requestId } = req.params;
  const { remarks } = req.body;
  const adminId = req.authUser.id;

  const { updatedRequest, newNotifications } = await service.approveRequest(
    requestId,
    remarks,
    adminId,
  );

  broadcastStoreInventory(io, updatedRequest.branch_id);
  io.to(`branch:${updatedRequest.branch_id}`).emit(
    "branch:notification",
    newNotifications,
  );

  return res.status(200).json({
    success: true,
    message:
      "Inventory request approved and store inventory updated successfully",
    updatedRequest,
  });
});

export const declineRequest = asyncHandler(async (req, res) => {
  const io = req.app.get("io");

  const { requestId } = req.params;
  const { remarks } = req.body;
  const adminId = req.authUser.id;

  const { updatedRequest, newNotifications } = await service.declineRequest(
    requestId,
    remarks,
    adminId,
  );

  broadcastStoreInventory(io, updatedRequest.branch_id);
  io.to(`branch:${updatedRequest.branch_id}`).emit(
    "branch:notification",
    newNotifications,
  );

  return res.status(200).json({
    success: true,
    message: "Inventory request declined successfully",
    updatedRequest,
  });
});
