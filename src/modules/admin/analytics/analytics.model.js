import db from "../../../config/db.js";

class AdminAnalyticsModel {
  async getKPIs() {
    const sql = `
      SELECT JSON_BUILD_OBJECT(
        'revenue', JSON_BUILD_OBJECT(
          'today',     COALESCE(rev_today, 0),
          'yesterday', COALESCE(rev_yesterday, 0)
        ),
        'totalOrders', JSON_BUILD_OBJECT(
          'today',     COALESCE(ord_today, 0),
          'yesterday', COALESCE(ord_yesterday, 0)
        ),
        'avgOrderValue', JSON_BUILD_OBJECT(
          'today',     COALESCE(ROUND(avg_today::numeric, 2), 0),
          'yesterday', COALESCE(ROUND(avg_yesterday::numeric, 2), 0)
        ),
        'activeStores', COALESCE(active_stores, 0)
      ) AS kpis
      FROM (
        SELECT 
          SUM(CASE WHEN placed_at::date = CURRENT_DATE     AND order_status != 'CANCELLED' THEN total_amount ELSE 0 END) AS rev_today,
          SUM(CASE WHEN placed_at::date = CURRENT_DATE - 1 AND order_status != 'CANCELLED' THEN total_amount ELSE 0 END) AS rev_yesterday,
          COUNT(CASE WHEN placed_at::date = CURRENT_DATE     AND order_status != 'CANCELLED' THEN 1 END)                 AS ord_today,
          COUNT(CASE WHEN placed_at::date = CURRENT_DATE - 1 AND order_status != 'CANCELLED' THEN 1 END)                 AS ord_yesterday,
          AVG(CASE WHEN placed_at::date = CURRENT_DATE     AND order_status != 'CANCELLED' THEN total_amount END)        AS avg_today,
          AVG(CASE WHEN placed_at::date = CURRENT_DATE - 1 AND order_status != 'CANCELLED' THEN total_amount END)        AS avg_yesterday,
          (SELECT COUNT(*) FROM branches WHERE is_open = TRUE)                                                           AS active_stores
        FROM orders
        WHERE placed_at::date >= CURRENT_DATE - 1
      ) AS stats
    `;

    const { rows } = await db.query(sql);
    return rows[0]?.kpis;
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
      b.branch_id AS id,
      b.branch_name AS name,
      b.city AS location,
      br.region_name AS region,
      COALESCE(SUM(CASE WHEN o.order_status != 'CANCELLED' AND o.placed_at::date = CURRENT_DATE           THEN o.total_amount ELSE 0 END), 0) AS revenue_today,
      COALESCE(SUM(CASE WHEN o.order_status != 'CANCELLED' AND o.placed_at::date = CURRENT_DATE - 1       THEN o.total_amount ELSE 0 END), 0) AS revenue_yesterday,
      COUNT(CASE WHEN o.placed_at::date = CURRENT_DATE THEN o.order_id END) AS orders
    FROM branches b
    LEFT JOIN branches_regions br ON br.region_id = b.region_id
    LEFT JOIN orders o ON o.branch_id = b.branch_id
    GROUP BY b.branch_id, b.branch_name, b.city, br.region_name
    ORDER BY revenue_today DESC`;

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

  async getWeeklyRevenue() {
    const sql = `
        SELECT
            TO_CHAR(day, 'Dy') AS day,
            COALESCE(SUM(CASE WHEN br.region_name = 'Visayas'  THEN o.total_amount ELSE 0 END), 0) AS visayas,
            COALESCE(SUM(CASE WHEN br.region_name = 'Mindanao' THEN o.total_amount ELSE 0 END), 0) AS mindanao,
            COALESCE(SUM(CASE WHEN br.region_name = 'Luzon'    THEN o.total_amount ELSE 0 END), 0) AS luzon

        FROM GENERATE_SERIES(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
        ) AS day

        LEFT JOIN orders o            ON o.placed_at::date = day::date
                                    AND o.order_status    != 'CANCELLED'
        LEFT JOIN branches b          ON b.branch_id        = o.branch_id
        LEFT JOIN branches_regions br ON br.region_id        = b.region_id

        GROUP BY day
        ORDER BY day ASC`;

    const { rows } = await db.query(sql);
    return rows;
  }

  async getMonthlyRevenue() {
    const sql = `
        SELECT
            TO_CHAR(month, 'Mon') AS month,

            -- Previous year revenue per month, excluding cancelled orders
            COALESCE(SUM(
                CASE WHEN DATE_PART('year', o.placed_at) = DATE_PART('year', CURRENT_DATE) - 1
                AND o.order_status != 'CANCELLED'
                THEN o.total_amount ELSE 0 END
            ), 0) AS previous,
                
            -- Current year revenue per month, excluding cancelled orders
            COALESCE(SUM(
                CASE WHEN DATE_PART('year', o.placed_at) = DATE_PART('year', CURRENT_DATE)
                AND o.order_status != 'CANCELLED'
                THEN o.total_amount ELSE 0 END
            ), 0) AS current

        FROM GENERATE_SERIES(
        DATE_TRUNC('year', CURRENT_DATE),
        CURRENT_DATE,
        INTERVAL '1 month'
        ) AS month
            
            LEFT JOIN orders o ON DATE_TRUNC('month', o.placed_at) = DATE_TRUNC('month', month)
                                AND o.order_status != 'CANCELLED'
        GROUP BY month`;

    const { rows } = await db.query(sql);
    return rows;
  }

  async getProductBestSeller() {
    const sql = `
    SELECT
      p.product_id AS id,
      p.product_name AS name,
      pc.category_name AS category,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
              AND o.placed_at::date = CURRENT_DATE
            THEN oi.quantity
            ELSE 0
          END
        ),
        0
      ) AS sold,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
              AND o.placed_at::date = CURRENT_DATE
            THEN oi.quantity * oi.unit_price
            ELSE 0
          END
        ),
        0
      ) AS revenue,

      ROUND(
        (
          (
            SUM(
              CASE
                WHEN o.order_status != 'CANCELLED'
                  AND o.placed_at::date = CURRENT_DATE
                THEN oi.quantity * oi.unit_price
                ELSE 0
              END
            )
            -
            SUM(
              CASE
                WHEN o.order_status != 'CANCELLED'
                  AND o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                THEN oi.quantity * oi.unit_price
                ELSE 0
              END
            )
          )
          /
          NULLIF(
            SUM(
              CASE
                WHEN o.order_status != 'CANCELLED'
                  AND o.placed_at::date = CURRENT_DATE - INTERVAL '1 day'
                THEN oi.quantity * oi.unit_price
                ELSE 0
              END
            ),
            0
          )
        ) * 100,
        2
      ) AS growth,

      (
        SELECT ARRAY_AGG(region_name)
        FROM (
          SELECT br.region_name
          FROM order_items oi2
          JOIN orders o2
            ON o2.order_id = oi2.order_id
          JOIN branches b2
            ON b2.branch_id = o2.branch_id
          JOIN branches_regions br
            ON br.region_id = b2.region_id
          WHERE oi2.product_id = p.product_id
            AND o2.order_status != 'CANCELLED'
            AND o2.placed_at::date = CURRENT_DATE
          GROUP BY br.region_name
          ORDER BY SUM(oi2.quantity) DESC
          LIMIT 2
        ) top_regions
      ) AS popular_in

    FROM products p
    JOIN product_categories pc
      ON pc.category_id = p.category_id
    LEFT JOIN order_items oi
      ON oi.product_id = p.product_id
    LEFT JOIN orders o
      ON o.order_id = oi.order_id

    GROUP BY
      p.product_id,
      p.product_name,
      pc.category_name

    HAVING
      SUM(
        CASE
          WHEN o.order_status != 'CANCELLED'
            AND o.placed_at::date = CURRENT_DATE
          THEN oi.quantity * oi.unit_price
          ELSE 0
        END
      ) > 0

    ORDER BY revenue DESC;
  `;

    const { rows } = await db.query(sql);
    return rows;
  }
}

export const adminAnalyticsModel = new AdminAnalyticsModel();
