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
