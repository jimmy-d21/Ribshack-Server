import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./notification.service.js";

export const getAllNotifications = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const notifications = await service.getAllNotifications(branchId);
  return res.status(200).json({ success: true, notifications });
});
