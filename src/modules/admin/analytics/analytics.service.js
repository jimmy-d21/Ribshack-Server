import { adminAnalyticsModel as model } from "./analytics.model.js";

const formatTrend = (value) => {
  const num = parseFloat(value);
  return num > 0 ? `+${num}%` : `${num}%`;
};

export const getKPIS = async () => {
  const raw = await model.getKPIs();
  return {
    totalRevenue: parseFloat(raw.total_revenue),
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
  const REGION_COLORS = {
    Visayas: "#10b981",
    Mindanao: "#f59e0b",
    Luzon: "#3b82f6",
  };

  const formatTrend = (value) => {
    const num = parseFloat(value ?? 0);
    return num > 0 ? `+${num}%` : `${num}%`;
  };
  const rows = await model.getRegionalRevenue();

  // Calculate total revenue across all regions for percentage
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
  const formatGrowth = (value) => {
    const num = parseFloat(value ?? 0);
    return num > 0 ? `+${num}%` : `${num}%`;
  };

  const rows = await model.getTopBranches();

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    location: r.location,
    region: r.region,
    revenue: parseFloat(r.revenue),
    orders: parseInt(r.orders),
    growth: formatGrowth(r.growth),
  }));
};

export const getSalesBycategory = async () => {
  const CATEGORY_COLORS = {
    Pork: "#ef4444",
    Chicken: "#f97316",
    Seafood: "#3b82f6",
    Sides: "#10b981",
    Drinks: "#06b6d4",
  };

  const rows = await model.getSalesByCategory();

  const totalRevenue = rows.reduce((sum, r) => sum + parseInt(r.value), 0);

  const percentage = (value) => {
    return totalRevenue > 0
      ? parseFloat(((parseFloat(value) / totalRevenue) * 100).toFixed(1))
      : 0;
  };

  return rows.map((r) => ({
    name: r.name,
    value: parseInt(r.value),
    percentage: percentage(r.value),
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

// Module-level helper — defined once, not recreated on every call
const formatGrowth = (value) => {
  const num = parseFloat(value ?? 0);
  return num > 0 ? `+${num}%` : `${num}%`;
};

export const getProductBestSeller = async () => {
  const rows = await model.getProductBestSeller();

  return rows.map((r) => ({
    id: parseInt(r.id),
    name: r.name,
    category: r.category,
    sold: parseInt(r.sold),
    revenue: parseFloat(r.revenue),
    growth: formatGrowth(r.growth),
    popularIn: r.popular_in ?? [],
  }));
};
