import db from "../../../config/db.js";

class StoreKitchenModel {
  async findOrders(branchId) {
    const sql = `
    SELECT
      o.order_id                     AS "id",
      o.order_number                 AS "orderNumber",
      u.full_name                    AS "customerName",
      o.order_status                 AS "status",
      oin.instruction_text           AS "specialInstructions",
      o.total_amount::float          AS "totalAmount",
      o.payment_method               AS "paymentMethod",
      o.placed_at                    AS "placedAt",
      dd.full_address                AS "fullAddress",

      COALESCE((
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'orderItemId', oi.order_item_id,
            'productId',   oi.product_id,
            'name',        p.product_name,
            'image',       pi.image_url,
            'quantity',    oi.quantity,
            'unitPrice',   oi.unit_price,
            'addonsTotal', oi.addons_total,
            'subtotal',    oi.subtotal,
            'addons', JSON_BUILD_OBJECT(
              'drinks', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'drink'
              ), '[]'::json),
              'extras', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'extra'
              ), '[]'::json)
            )
          ) ORDER BY oi.created_at DESC
        )
        FROM order_items oi
        JOIN products p ON p.product_id = oi.product_id
        JOIN product_images pi
          ON pi.product_id = p.product_id
         AND pi.is_primary = TRUE
        WHERE oi.order_id = o.order_id
      ), '[]'::json)                 AS "items"

    FROM orders o
    JOIN users u                       ON u.user_id   = o.customer_id
    JOIN delivery_details dd           ON dd.order_id = o.order_id
    LEFT JOIN order_instructions oin   ON oin.order_id = o.order_id
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
      o.order_id                     AS "id",
      o.order_number                 AS "orderNumber",
      u.full_name                    AS "customerName",
      u.contact_number               AS "contactNumber",
      o.order_status                 AS "status",
      oin.instruction_text           AS "specialInstructions",
      o.total_amount::float          AS "totalAmount",
      o.payment_method               AS "paymentMethod",
      o.placed_at                    AS "placedAt",
      dd.full_address                AS "fullAddress",

      COALESCE((
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'orderItemId', oi.order_item_id,
            'productId',   oi.product_id,
            'name',        p.product_name,
            'image',       pi.image_url,
            'quantity',    oi.quantity,
            'unitPrice',   oi.unit_price::float,
            'addonsTotal', oi.addons_total::float,
            'subtotal',    oi.subtotal::float,
            'addons', JSON_BUILD_OBJECT(
              'drinks', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price::float
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'drink'
              ), '[]'::json),
              'extras', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price::float
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'extra'
              ), '[]'::json)
            )
          ) ORDER BY oi.created_at DESC
        )
        FROM order_items oi
        JOIN products p ON p.product_id = oi.product_id
        JOIN product_images pi
          ON pi.product_id = p.product_id
         AND pi.is_primary = TRUE
        WHERE oi.order_id = o.order_id
      ), '[]'::json)                 AS "items"

    FROM orders o
    JOIN users u                       ON u.user_id   = o.customer_id
    JOIN delivery_details dd           ON dd.order_id = o.order_id
    LEFT JOIN order_instructions oin   ON oin.order_id = o.order_id
    WHERE o.order_id  = $1
      AND o.branch_id = $2
  `;
    const { rows } = await db.query(sql, [orderId, branchId]);
    return rows[0] ?? null;
  }

  async findOrderById(orderId, branchId) {
    const sql = `
    SELECT
      o.order_id                     AS "id",
      o.order_number                 AS "orderNumber",
      u.user_id                      AS "customerId",
      u.full_name                    AS "customerName",
      o.order_status                 AS "status",
      oin.instruction_text           AS "specialInstructions",
      o.total_amount::float          AS "totalAmount",
      o.payment_method               AS "paymentMethod",
      o.placed_at                    AS "placedAt",
      dd.full_address                AS "fullAddress",

      COALESCE((
        SELECT JSON_AGG(
          JSON_BUILD_OBJECT(
            'orderItemId', oi.order_item_id,
            'productId',   oi.product_id,
            'name',        p.product_name,
            'image',       pi.image_url,
            'quantity',    oi.quantity,
            'unitPrice',   oi.unit_price::float,
            'addonsTotal', oi.addons_total::float,
            'subtotal',    oi.subtotal::float,
            'addons', JSON_BUILD_OBJECT(
              'drinks', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price::float
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'drink'
              ), '[]'::json),
              'extras', COALESCE((
                SELECT JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id',    oia.order_addon_id,
                    'name',  oia.addon_name,
                    'price', oia.addon_price::float
                  )
                )
                FROM order_item_addons oia
                JOIN product_addons pa ON oia.addon_id = pa.addon_id
                WHERE oia.order_item_id = oi.order_item_id
                  AND pa.addon_type = 'extra'
              ), '[]'::json)
            )
          ) ORDER BY oi.created_at DESC
        )
        FROM order_items oi
        JOIN products p ON p.product_id = oi.product_id
        JOIN product_images pi
          ON pi.product_id = p.product_id
         AND pi.is_primary = TRUE
        WHERE oi.order_id = o.order_id
      ), '[]'::json)                 AS "items"

    FROM orders o
    JOIN users u                       ON u.user_id   = o.customer_id
    JOIN delivery_details dd           ON dd.order_id = o.order_id
    LEFT JOIN order_instructions oin   ON oin.order_id = o.order_id
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
