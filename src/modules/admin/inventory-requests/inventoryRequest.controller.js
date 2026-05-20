import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./inventoryRequest.service.js";

export const getAllRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const inventoryRequests = await service.getAllRequests(status);
  return res.status(200).json({ success: true, inventoryRequests });
});

export const approveRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { remarks } = req.body;
  const adminId = req.authUser.id;

  const data = await service.approveRequest(requestId, remarks, adminId);
  return res.status(200).json({
    success: true,
    message:
      "Inventory request approved and store inventory updated successfully",
    data,
  });
});

export const declineRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const { remarks } = req.body;
  const adminId = req.authUser.id;

  const data = await service.declineRequest(requestId, remarks, adminId);
  return res.status(200).json({
    success: true,
    message: "Inventory request declined successfully",
    data,
  });
});
