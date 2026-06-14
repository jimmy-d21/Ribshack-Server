import { formatGrowth } from "../../../utils/analytics.utils.js";
import { storeDashboardModel as model } from "./dashboard.model.js";

export const getKPIS = async (branchId) => {
  const kpis = await model.kpis(branchId);

  return {
    revenue: {
      todayRevenue: kpis.revenue.today,
      growth: formatGrowth(kpis.revenue),
    },
    totalOrders: {
      todayOrders: kpis.totalOrders.today,
      growth: formatGrowth(kpis.totalOrders),
    },
    avgOrderValue: {
      todayAvg: kpis.avgOrderValue.today,
      growth: formatGrowth(kpis.avgOrderValue),
    },
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
