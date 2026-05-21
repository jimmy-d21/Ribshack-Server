import { storeDashboardModel as model } from "./dashboard.model.js";

export const getKPIS = async (branchId) => {
  const raw = await model.kpis(branchId);

  return {
    grossRevenue: parseFloat(raw.grossRevenue),
    totalOrders: parseInt(raw.totalOrders),
    avgOrderValue: parseFloat(raw.avgOrderValue),
  };
};

export const getWeeklyRevenue = async (branchId) => {
  const rows = await model.weeklyRevenue(branchId);

  return rows.map((r) => ({
    day: r.day,
    revenue: parseInt(r.revenue),
  }));
};
