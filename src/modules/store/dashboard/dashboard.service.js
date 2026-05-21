import { storeDashboardModel as model } from "./dashboard.model.js";

export const getKPIS = async (branchId) => {
  const raw = await model.kpis(branchId);

  return {
    grossRevenue: parseFloat(raw.grossRevenue) || 0,
    totalOrders: parseInt(raw.totalOrders) || 0,
    avgOrderValue: parseFloat(raw.avgOrderValue) || 0,
  };
};
