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
