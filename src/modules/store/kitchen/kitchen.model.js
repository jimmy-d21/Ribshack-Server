import db from "../../../config/db.js";

class StoreKitchenModel {
  async findKitchenOrders(branchId) {
    const sql = `
      SELECT
        o.order_id                       AS id,
        u.full_name                      AS "customerName",
        o.order_status                   AS status,
        oin.instruction_text             AS "specialInstructions",
        o.total_amount                   AS "totalAmount",

        COALESCE((
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id',          oi.order_item_id,
              'productName', p.product_name,
              'quantity',    oi.quantity,

              -- Addons per item as JSON array
              'addons', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',   oia.order_addon_id,
                    'name', oia.addon_name
                  )
                )
                FROM order_item_addons oia
                WHERE oia.order_item_id = oi.order_item_id
              ), '[]'::json)
            ) ORDER BY oi.created_at DESC
          )
          FROM order_items oi
          JOIN products p ON p.product_id = oi.product_id
          WHERE oi.order_id = o.order_id
        ), '[]'::json)                   AS items

      FROM orders o
      JOIN users u                   ON u.user_id   = o.customer_id
      LEFT JOIN order_instructions oin ON oin.order_id = o.order_id

      WHERE o.branch_id    = $1
        AND o.order_status IN ('PLACED', 'PREPARING', 'READY')

      ORDER BY o.placed_at DESC
    `;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const storeKitchenModel = new StoreKitchenModel();
