import db from "../../../config/db.js";

class StoreKitchenModel {
  async findOrders(branchId) {
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

  async findOrderDetails(orderId, branchId) {
    const sql = `
        SELECT
            o.order_id           AS id,
            u.full_name          AS "customerName",
            o.order_status       AS status,
            o.placed_at          AS "orderReceivedAt",
            dd.full_address      AS "deliveryAddress",
            oin.instruction_text AS "specialInstructions",
            o.total_amount       AS "totalAmount",

            COALESCE((
                SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id',          oi.order_item_id,
                    'productName', p.product_name,
                    'quantity',    oi.quantity,
                    'totalPrice',   oi.quantity * oi.unit_price,

                    'addons', COALESCE((
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                            'id',    oia.order_addon_id,
                            'name',  oia.addon_name,
                            'price', oia.addon_price
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
                ), '[]'::json)       AS items

            FROM orders o
            JOIN  users u                    ON u.user_id   = o.customer_id
            LEFT JOIN delivery_details dd    ON dd.order_id = o.order_id  
            LEFT JOIN order_instructions oin ON oin.order_id = o.order_id

            WHERE o.order_id  = $1
            AND o.branch_id = $2
        `;

    const { rows } = await db.query(sql, [orderId, branchId]);
    return rows[0] ?? null;
  }

  async findOrderById(orderId, branchId) {
    const sql = `
        SELECT
            o.order_id           AS id,
            u.full_name          AS "customerName",
            o.order_status       AS status,
            o.placed_at          AS "orderReceivedAt",
            dd.full_address      AS "deliveryAddress",
            oin.instruction_text AS "specialInstructions",
            o.total_amount       AS "totalAmount",

            COALESCE((
                SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id',          oi.order_item_id,
                    'productName', p.product_name,
                    'quantity',    oi.quantity,
                    'totalPrice',   oi.quantity * oi.unit_price,

                    'addons', COALESCE((
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                            'id',    oia.order_addon_id,
                            'name',  oia.addon_name,
                            'price', oia.addon_price
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
                ), '[]'::json)       AS items

            FROM orders o
            JOIN  users u                    ON u.user_id   = o.customer_id
            LEFT JOIN delivery_details dd    ON dd.order_id = o.order_id  
            LEFT JOIN order_instructions oin ON oin.order_id = o.order_id

            WHERE o.order_id  = $1
            AND o.branch_id = $2
        `;

    const { rows } = await db.query(sql, [orderId, branchId]);
    return rows[0] ?? null;
  }

  async updateOrderById(orderId, branchId, status) {
    const sql = `
    UPDATE orders
    SET order_status = $1,
        updated_at   = CURRENT_TIMESTAMP
    WHERE order_id  = $2
      AND branch_id = $3
    RETURNING order_id, order_status, updated_at
  `;
    const { rows } = await db.query(sql, [status, orderId, branchId]);
    return rows[0];
  }

  async createStatusLog(orderId, status) {
    const sql = `
    INSERT INTO order_status_logs (order_id, status)
    VALUES ($1, $2)
    RETURNING *
  `;
    const { rows } = await db.query(sql, [orderId, status]);
    return rows[0];
  }
}

export const storeKitchenModel = new StoreKitchenModel();
