import db from "../../../config/db.js";

class StoreDashboardModel {
  async kpis(branchId) {
    const sql = `
    WITH stats AS (
      SELECT 
        SUM(CASE WHEN placed_at::date = CURRENT_DATE AND order_status != 'CANCELLED' THEN total_amount ELSE 0 END) as rev_today,
        SUM(CASE WHEN placed_at::date = CURRENT_DATE - 1 AND order_status != 'CANCELLED' THEN total_amount ELSE 0 END) as rev_yesterday,
        COUNT(CASE WHEN placed_at::date = CURRENT_DATE AND order_status != 'CANCELLED' THEN 1 END) as ord_today,
        COUNT(CASE WHEN placed_at::date = CURRENT_DATE - 1 AND order_status != 'CANCELLED' THEN 1 END) as ord_yesterday,
        AVG(CASE WHEN placed_at::date = CURRENT_DATE AND order_status != 'CANCELLED' THEN total_amount END) as avg_today
      FROM orders
      WHERE branch_id = $1 AND placed_at::date >= CURRENT_DATE - 1
    )
    SELECT JSON_BUILD_OBJECT(
      'grossRevenue', COALESCE(rev_today, 0),
      'totalOrders', COALESCE(ord_today, 0),
      'avgOrderValue', COALESCE(ROUND(avg_today::numeric, 2), 0),
      'trends', JSON_BUILD_OBJECT(
        'revenue', CASE 
          WHEN COALESCE(rev_yesterday, 0) = 0 THEN '+100%' 
          ELSE (CASE WHEN ((rev_today - rev_yesterday)/rev_yesterday::numeric)*100 >= 0 THEN '+' ELSE '' END) || ROUND(((rev_today - rev_yesterday)/rev_yesterday::numeric)*100, 1)::text || '%'
        END,
        'orders', CASE 
          WHEN COALESCE(ord_yesterday, 0) = 0 THEN '+100%' 
          ELSE (CASE WHEN ((ord_today - ord_yesterday)::numeric/NULLIF(ord_yesterday, 0))*100 >= 0 THEN '+' ELSE '' END) || ROUND(((ord_today - ord_yesterday)::numeric/NULLIF(ord_yesterday, 0))*100, 1)::text || '%'
        END
      )
    ) AS kpis
    FROM stats
  `;

    const { rows } = await db.query(sql, [branchId]);

    return rows[0]?.kpis;
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
            CURRENT_DATE + INTERVAL '10 hours',  
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

  async categorySales(branchId) {
    const sql = `
        SELECT
            pc.category_name AS "category",
            COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS "revenue",
            COUNT(DISTINCT o.order_id) AS "orders"
            FROM product_categories pc
            LEFT JOIN products p ON p.category_id = pc.category_id
            LEFT JOIN order_items oi ON oi.product_id = p.product_id
                                AND oi.created_at::date = CURRENT_DATE
            LEFT JOIN orders o ON o.order_id = oi.order_id 
                            AND o.branch_id = $1
                            AND o.order_status != 'CANCELLED'
                            AND o.placed_at::date = CURRENT_DATE
            GROUP BY pc.category_id, pc.category_name
            ORDER BY revenue DESC`;
    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }

  async bestseller(branchId) {
    const sql = `
        SELECT
            p.product_id AS "id",
            p.product_name AS "name",
            COALESCE(MAX(pi.image_url), '') AS "imageUrl", 
            pc.category_name AS "category",
            COALESCE(SUM(oi.quantity), 0) AS "quantitySold",
            COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS "revenue"
            FROM products p
            LEFT JOIN product_categories pc ON pc.category_id = p.category_id
            LEFT JOIN product_images pi ON pi.product_id = p.product_id
            LEFT JOIN order_items oi ON oi.product_id = p.product_id
            LEFT JOIN orders o ON o.order_id = oi.order_id
            WHERE (o.order_id IS NULL OR (
                    o.branch_id = $1 
                    AND o.order_status != 'CANCELLED' 
                    AND o.placed_at::date = CURRENT_DATE
                ))
            GROUP BY p.product_id, p.product_name, pc.category_name
            ORDER BY "revenue" DESC, "quantitySold" DESC`;
    const { rows } = await db.query(sql, [branchId]);
    return rows[0];
  }
}

export const storeDashboardModel = new StoreDashboardModel();
