import { adminAnalyticsModel as model } from "./analytics.model.js";
import {
  formatTrend,
  REGION_COLORS,
  CATEGORY_COLORS,
} from "../../../utils/analytics.utils.js";

export const getKPIS = async () => {
  const raw = await model.getKPIs();
  return {
    totalRevenue: parseInt(raw.total_revenue),
    totalOrders: parseInt(raw.total_orders),
    activeStores: parseInt(raw.active_stores),
    avgOrderValue: parseFloat(raw.avg_order_value),
    trends: {
      revenue: formatTrend(raw.trends.revenue),
      orders: formatTrend(raw.trends.orders),
      avgOrder: formatTrend(raw.trends.avgOrder),
    },
  };
};

export const getRegionalRevenue = async () => {
  const rows = await model.getRegionalRevenue();

  // Calculate total revenue across all regions for percentage share
  const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.revenue), 0);

  return rows.map((r) => ({
    region: r.region,
    branches: parseInt(r.branches),
    revenue: parseFloat(r.revenue),
    orders: parseInt(r.orders),
    percentage:
      totalRevenue > 0
        ? parseFloat(((parseFloat(r.revenue) / totalRevenue) * 100).toFixed(1))
        : 0,
    growth: formatTrend(r.growth),
    color: REGION_COLORS[r.region] ?? "#6b7280",
  }));
};

export const getTopBranches = async () => {
  const rows = await model.getTopBranches();

  return rows.map((r, index) => {
    const growthVal = parseFloat(r.growth ?? 0);

    return {
      id: parseInt(r.id),
      name: r.name,
      location: r.location,
      region: r.region,
      revenue: parseFloat(r.revenue ?? 0),
      orders: parseInt(r.orders ?? 0),
      growth: formatTrend(growthVal),
      note: index === 0 ? "Top Performer" : null,
    };
  });
};

export const getSalesByCategory = async () => {
  const rows = await model.getSalesByCategory();

  // Calculate total revenue across all categories for percentage share
  const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.value), 0);

  const getPercentage = (value) =>
    totalRevenue > 0
      ? parseFloat(((parseFloat(value) / totalRevenue) * 100).toFixed(1))
      : 0;

  return rows.map((r) => ({
    name: r.name,
    value: parseInt(r.value),
    percentage: getPercentage(r.value),
    color: CATEGORY_COLORS[r.name] ?? "#6b7280",
  }));
};

export const getWeeklyRevenue = async () => {
  const rows = await model.getWeeklyRevenue();

  return rows.map((r) => ({
    day: r.day,
    visayas: parseInt(r.visayas),
    mindanao: parseInt(r.mindanao),
    luzon: parseInt(r.luzon),
  }));
};

export const getMonthlyRevenue = async () => {
  const rows = await model.getMonthlyRevenue();

  return rows.map((r) => ({
    month: r.month,
    previous: parseInt(r.previous),
    current: parseInt(r.current),
  }));
};

export const getProductBestSeller = async () => {
  const rows = await model.getProductBestSeller();

  return rows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    category: r.category,
    sold: Number(r.sold ?? 0),
    revenue: Number(r.revenue ?? 0),
    growth: formatTrend(r.growth),
    popularIn: r.popular_in ?? [],
  }));
};
