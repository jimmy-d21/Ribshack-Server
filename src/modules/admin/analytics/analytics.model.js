import db from "../../../config/db.js";

class AdminAnalyticsModel {
  async getKPIs() {
    const sql = `
      SELECT
        -- Total revenue today, excluding cancelled orders
        COALESCE((
          SELECT SUM(total_amount)
          FROM orders
          WHERE order_status != 'CANCELLED'
          AND placed_at::date = CURRENT_DATE
        ), 0) AS total_revenue,

        -- Total orders placed today
        (
          SELECT COUNT(*)
          FROM orders
          WHERE placed_at::date = CURRENT_DATE
        ) AS total_orders,

        -- Number of branches currently open
        (
          SELECT COUNT(*)
          FROM branches
          WHERE is_open = TRUE
        ) AS active_stores,

        -- Average order value today, excluding cancelled orders
        COALESCE((
          SELECT ROUND(AVG(total_amount), 2)
          FROM orders
          WHERE order_status != 'CANCELLED'
          AND placed_at::date = CURRENT_DATE
        ), 0) AS avg_order_value,

        -- Trend percentages: today vs yesterday
        JSON_BUILD_OBJECT(
          'revenue', COALESCE((
            SELECT ROUND(
              (
                (SUM(CASE WHEN placed_at::date = CURRENT_DATE
                  THEN total_amount ELSE 0 END) -
                 SUM(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN total_amount ELSE 0 END))
                /
                NULLIF(SUM(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN total_amount ELSE 0 END), 0)
              ) * 100, 2)
            FROM orders
            WHERE order_status != 'CANCELLED'
          ), 0),

          'orders', COALESCE((
            SELECT ROUND(
              (
                (COUNT(CASE WHEN placed_at::date = CURRENT_DATE
                  THEN 1 END) -
                 COUNT(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN 1 END))
                /
                NULLIF(COUNT(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN 1 END), 0)::NUMERIC
              ) * 100, 2)
            FROM orders
          ), 0),

          'avgOrder', COALESCE((
            SELECT ROUND(
              (
                (AVG(CASE WHEN placed_at::date = CURRENT_DATE
                  THEN total_amount END) -
                 AVG(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN total_amount END))
                /
                NULLIF(AVG(CASE WHEN placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                  THEN total_amount END), 0)
              ) * 100, 2)
            FROM orders
            WHERE order_status != 'CANCELLED'
          ), 0)
        ) AS trends
    `;

    const { rows } = await db.query(sql);
    return rows[0];
  }
}

export const adminAnalyticsModel = new AdminAnalyticsModel();
