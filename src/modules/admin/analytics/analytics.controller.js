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

export const getSalesByCategory = asyncHandler(async (req, res) => {
  const salesByCategory = await service.getSalesByCategory();
  return res.status(200).json({ success: true, salesByCategory });
});

export const getWeeklyRevenue = asyncHandler(async (req, res) => {
  const weeklyRevenue = await service.getWeeklyRevenue();
  return res.status(200).json({ success: true, weeklyRevenue });
});

export const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const weeklyRevenue = await service.getMonthlyRevenue();
  return res.status(200).json({ success: true, weeklyRevenue });
});

export const getProductBestSeller = asyncHandler(async (req, res) => {
  const bestsellers = await service.getProductBestSeller();
  return res.status(200).json({ success: true, bestsellers });
});
