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
}

export const storeDashboardModel = new StoreDashboardModel();
