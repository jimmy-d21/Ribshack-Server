// ============================================================
// Shared formatting helpers for analytics responses
// ============================================================

export const formatTrend = (value) => {
  if (value === null || value === undefined) {
    return "New";
  }

  const growth = Number(value);

  if (growth === 0) {
    return "0%";
  }

  return growth > 0 ? `+${growth.toFixed(2)}%` : `${growth.toFixed(2)}%`;
};

export const formatGrowth = (value) => {
  const growth = ((value.today - value.yesterday) / value.yesterday) * 100;

  return value.today > 0 && value.yesterday > 0
    ? growth > 0
      ? `+${growth}`
      : `-${growth}`
    : "";
};

// ============================================================
// Color maps for chart rendering on the frontend
// ============================================================

export const REGION_COLORS = {
  Visayas: "#10b981",
  Mindanao: "#f59e0b",
  Luzon: "#3b82f6",
};

export const CATEGORY_COLORS = {
  Pork: "#ef4444",
  Chicken: "#f97316",
  Seafood: "#3b82f6",
  Sides: "#10b981",
  Drinks: "#06b6d4",
};
