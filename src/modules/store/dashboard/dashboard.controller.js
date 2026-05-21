import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./dashboard.service.js";

export const getKPIS = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const kpis = await service.getKPIS(branchId);
  return res.status(200).json({ success: true, todayStats: kpis });
});

export const getWeeklyRevenue = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const weeklyRevenue = await service.getWeeklyRevenue(branchId);
  return res.status(200).json({ success: true, weeklyRevenue });
});

export const getHourlyRevenue = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const hourlyRevenue = await service.getHourlyRevenue(branchId);
  return res.status(200).json({ success: true, hourlyRevenue });
});

export const getCategorySales = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const categorySales = await service.getCategorySales(branchId);
  return res.status(200).json({ success: true, categorySales });
});

export const getBestSeller = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const bestsellerOfTheDay = await service.getBestSeller(branchId);
  return res.status(200).json({ success: true, bestsellerOfTheDay });
});
