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

  async getRegionalRevenue() {
    const sql = `
            SELECT
            br.region_name AS region,
            COUNT(DISTINCT b.branch_id) AS branches,

            -- Total revenue today per region (excluding cancelled)
            COALESCE(SUM(
                CASE WHEN o.order_status != 'CANCELLED'
                AND o.placed_at::date = CURRENT_DATE
                THEN o.total_amount ELSE 0 END
            ), 0) AS revenue,

            -- Total orders today per region
            COUNT(
                CASE WHEN o.placed_at::date = CURRENT_DATE
                THEN o.order_id END
            ) AS orders,

            -- Revenue trend: today vs yesterday
            -- growth = ((today - yesterday) / yesterday) * 100
            ROUND(
                (
                (SUM(CASE WHEN o.placed_at::date = CURRENT_DATE
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END) -
                SUM(CASE WHEN o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END))
                /
                NULLIF(SUM(CASE WHEN o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END), 0)
                ) * 100, 2
            ) AS growth

            FROM branches_regions br
            LEFT JOIN branches b  ON b.region_id = br.region_id
            LEFT JOIN orders o    ON o.branch_id  = b.branch_id
            GROUP BY br.region_id, br.region_name
            ORDER BY revenue DESC
            `;

    const { rows } = await db.query(sql);
    return rows;
  }

  async getTopBranches() {
    const sql = `
        SELECT
            b.branch_id    AS id,
            b.branch_name  AS name,
            b.city         AS location,
            br.region_name AS region,

            -- Total revenue today, excluding cancelled orders
            COALESCE(SUM(
                CASE WHEN o.order_status != 'CANCELLED'
                AND o.placed_at::date = CURRENT_DATE
                THEN o.total_amount ELSE 0 END
            ), 0) AS revenue,

            -- Total orders placed today
            COUNT(
                CASE WHEN o.placed_at::date = CURRENT_DATE
                THEN o.order_id END
            ) AS orders,

            -- Revenue trend: today vs yesterday
            -- growth = ((today - yesterday) / yesterday) * 100
            ROUND(
                (
                (SUM(CASE WHEN o.placed_at::date = CURRENT_DATE
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END) -
                SUM(CASE WHEN o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END))
                /
                NULLIF(SUM(CASE WHEN o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                    AND o.order_status != 'CANCELLED'
                    THEN o.total_amount ELSE 0 END), 0)
                ) * 100, 2
            ) AS growth

            FROM branches b
            LEFT JOIN branches_regions br ON br.region_id = b.region_id
            LEFT JOIN orders o             ON o.branch_id  = b.branch_id
            GROUP BY b.branch_id, b.branch_name, b.city, br.region_name
            ORDER BY revenue DESC`;

    const { rows } = await db.query(sql);
    return rows;
  }

  async getSalesByCategory() {
    const sql = `
        SELECT
            pc.category_name AS name,

            -- Total revenue today per category, excluding cancelled orders
            COALESCE(SUM(
                CASE WHEN o.order_status != 'CANCELLED'
                AND o.placed_at::date = CURRENT_DATE
                THEN o.total_amount ELSE 0 END
            ), 0) AS value

        FROM product_categories pc
        LEFT JOIN products p        ON p.category_id  = pc.category_id
        LEFT JOIN order_items oi    ON oi.product_id  = p.product_id
        LEFT JOIN orders o          ON o.order_id     = oi.order_id
        GROUP BY pc.category_id, pc.category_name
        ORDER BY value DESC`;

    const { rows } = await db.query(sql);
    return rows;
  }
}

export const adminAnalyticsModel = new AdminAnalyticsModel();
