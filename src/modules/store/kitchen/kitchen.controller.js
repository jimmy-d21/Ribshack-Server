import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./kitchen.service.js";

export const getKitchenOrders = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const kitchenOrders = await service.getKitchenOrders(branchId);
  return res.status(200).json({ success: true, kitchenOrders });
});
