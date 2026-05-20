import * as service from "./analytics.service.js";
import asyncHandler from "../../../utils/asyncHandler.js";

export const getKPIS = asyncHandler(async (req, res) => {
  const kpis = await service.getKPIS();
  return res.status(200).json({ success: true, kpis });
});

export const getRegionalRevenue = asyncHandler(async (req, res) => {
  const regionPerformance = await service.getRegionalRevenue();
  return res.status(200).json({ success: true, regionPerformance });
});

export const getTopBranches = asyncHandler(async (req, res) => {
  const topBranches = await service.getTopBranches();
  return res.status(200).json({ success: true, topBranches });
});
