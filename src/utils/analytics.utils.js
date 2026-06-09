// ============================================================
// Shared formatting helpers for analytics responses
// ============================================================

export const formatTrend = (value) => {
  if (value === 0) return "0%";
  return value > 0 ? `+${value}%` : `${value}%`;
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
