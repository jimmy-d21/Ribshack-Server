import db from "../../../config/db.js";

class StoreDashboardModel {
  async kpis(branchId) {
    const sql = `
      SELECT JSON_BUILD_OBJECT(
        -- Total revenue today, excluding cancelled orders
        'grossRevenue', COALESCE((
          SELECT SUM(total_amount)
          FROM orders
          WHERE order_status != 'CANCELLED'
            AND placed_at::date = CURRENT_DATE
            AND branch_id = $1
        ), 0),

        -- Total orders today, excluding cancelled orders
        'totalOrders', COALESCE((
          SELECT COUNT(order_id)
          FROM orders
          WHERE order_status != 'CANCELLED'
            AND placed_at::date = CURRENT_DATE
            AND branch_id = $1
        ), 0),

        -- Average order value today, excluding cancelled orders
        'avgOrderValue', COALESCE((
          SELECT ROUND(AVG(total_amount), 2)
          FROM orders
          WHERE order_status != 'CANCELLED'
            AND placed_at::date = CURRENT_DATE
            AND branch_id = $1
        ), 0)
      ) AS kpis
    `;

    const { rows } = await db.query(sql, [branchId]);
    return rows[0].kpis;
  }

  async weeklyRevenue(branchId) {
    const sql = `
        SELECT
        TO_CHAR(day, 'Dy') AS day,
        COALESCE(SUM(
            CASE WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount ELSE 0 END
        ), 0) AS revenue

        FROM GENERATE_SERIES(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
        ) AS day
        
        LEFT JOIN orders o ON o.placed_at::date = day::date
                        AND o.branch_id        = $1
                        AND o.order_status    != 'CANCELLED'

        GROUP BY day
        ORDER BY day ASC
    `;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }

  async hourlyRevenue(branchId) {
    const sql = `
        SELECT
            TO_CHAR(series_hour, 'FMHH12:MI AM') AS "hour",
            COALESCE(SUM(o.total_amount), 0)::float AS "revenue"
            FROM GENERATE_SERIES(
            CURRENT_DATE + INTERVAL '8 hours',  
            CURRENT_DATE + INTERVAL '21 hours', 
            INTERVAL '1 hour'
            ) AS series_hour
            LEFT JOIN orders o ON DATE_TRUNC('hour', o.placed_at) = series_hour
                            AND o.branch_id = $1
                            AND o.order_status != 'CANCELLED'
            GROUP BY series_hour
            ORDER BY series_hour ASC
    `;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const storeDashboardModel = new StoreDashboardModel();
