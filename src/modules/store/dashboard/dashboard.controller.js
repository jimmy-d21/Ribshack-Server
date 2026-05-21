import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./dashboard.service.js";

export const getKPIS = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const kpis = await service.getKPIS(branchId);
  return res.status(200).json({ success: true, todayStats: kpis });
});
