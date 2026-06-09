import { storeDashboardModel as model } from "./dashboard.model.js";

export const getKPIS = async (branchId) => {
  const kpis = await model.kpis(branchId);

  return {
    grossRevenue: parseFloat(kpis.grossRevenue || 0),
    totalOrders: parseInt(kpis.totalOrders || 0),
    avgOrderValue: parseFloat(kpis.avgOrderValue || 0),
    trends: kpis.trends || { revenue: "+0%", orders: "+0%" },
  };
};

export const getWeeklyRevenue = async (branchId) => {
  const rows = await model.weeklyRevenue(branchId);

  return rows.map((r) => ({
    day: r.day,
    revenue: parseInt(r.revenue),
  }));
};

export const getHourlyRevenue = async (branchId) => {
  const rows = await model.hourlyRevenue(branchId);

  return rows.map((r) => ({
    hour: r.hour,
    revenue: parseFloat(r.revenue),
  }));
};

export const getCategorySales = async (branchId) => {
  const rows = await model.categorySales(branchId);

  return rows.map((r) => ({
    category: r.category,
    revenue: parseInt(r.revenue ?? 0),
    orders: parseInt(r.orders ?? 0),
  }));
};

export const getBestSeller = async (branchId) => {
  const raw = await model.bestseller(branchId);

  return {
    productId: raw.id,
    productName: raw.name,
    imageUrl: raw.imageUrl,
    category: raw.category,
    quantitySold: parseInt(raw.quantitySold),
    revenue: parseFloat(raw.revenue),
  };
};
