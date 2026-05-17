import db from "../../../config/db.js";

class AppOrderModel {
  async findAll(client = db, userId) {
    const sql = `
      SELECT
        c.cart_id                   AS "id",
        c.created_at                AS "createdAt",
        ci.cart_item_id             AS "cartItemId",
        p.product_id                AS "productId",
        p.product_name              AS "name",
        p.base_price                AS "productPrice",
        pi.image_url                AS "image",
        ci.unit_price * ci.quantity AS "price",
        ci.quantity                 AS "quantity",
        (
          SELECT JSON_BUILD_OBJECT(
            'drinks', (
              SELECT COALESCE(JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id',    cia.cart_addon_id,
                  'name',  cia.addon_name,
                  'price', cia.addon_price
                )
              ), '[]'::json)
              FROM cart_item_addons cia
              JOIN product_addons pa ON cia.addon_id = pa.addon_id
              WHERE cia.cart_item_id = ci.cart_item_id
                AND pa.addon_type = 'drink'
            ),
            'extras', (
              SELECT COALESCE(JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id',    cia.cart_addon_id,
                  'name',  cia.addon_name,
                  'price', cia.addon_price
                )
              ), '[]'::json)
              FROM cart_item_addons cia
              JOIN product_addons pa ON cia.addon_id = pa.addon_id
              WHERE cia.cart_item_id = ci.cart_item_id
                AND pa.addon_type = 'extra'
            )
          )
        )                           AS "addons"
      FROM carts c
      JOIN cart_items ci  ON c.cart_id     = ci.cart_id
      JOIN products p     ON ci.product_id = p.product_id
      JOIN product_images pi
        ON p.product_id  = pi.product_id
       AND pi.is_primary = TRUE
      WHERE c.customer_id = $1
      ORDER BY ci.created_at DESC
    `;
    const { rows } = await client.query(sql, [userId]);
    return rows;
  }

  async findAddressesByUserId(client = db, userId) {
    const sql = `
      SELECT
        address_id    AS "id",
        address_label AS "label",
        full_address  AS "fullAddress",
        city,
        province,
        postal_code   AS "postalCode",
        land_mark     AS "landMark",
        is_default    AS "isDefault",
        created_at    AS "createdAt"
      FROM   customer_addresses
      WHERE  customer_id = $1
        AND  is_default  = TRUE
    `;
    const { rows } = await client.query(sql, [userId]);
    return rows[0] ?? null;
  }

  async createOrder(client, userId, branchId, totalAmount, paymentMethod) {
    const sql = `
      INSERT INTO orders
        (customer_id, branch_id, total_amount, payment_method)
      VALUES ($1, $2, $3, $4)
      RETURNING
        order_id       AS "orderId",
        order_status   AS "orderStatus",
        total_amount   AS "totalAmount",
        payment_method AS "paymentMethod",
        placed_at      AS "placedAt"
    `;
    const { rows } = await client.query(sql, [
      userId,
      branchId,
      totalAmount,
      paymentMethod,
    ]);
    return rows[0];
  }

  async createOrderItem(
    client,
    orderId,
    productId,
    quantity,
    unitPrice,
    addonsTotal,
    subtotal,
  ) {
    // Inserts into order_items, not orders
    const sql = `
      INSERT INTO order_items
        (order_id, product_id, quantity, unit_price, addons_total, subtotal)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        order_item_id AS "orderItemId",
        order_id      AS "orderId",
        product_id    AS "productId",
        quantity,
        unit_price    AS "unitPrice",
        addons_total  AS "addonsTotal",
        subtotal
    `;
    const values = [
      orderId,
      productId,
      quantity,
      unitPrice,
      addonsTotal,
      subtotal,
    ];
    const { rows } = await client.query(sql, values);
    return rows[0];
  }

  async createOrderItemAddon(
    client,
    orderItemId,
    { addonId, addonName, addonPrice },
  ) {
    const sql = `
      INSERT INTO order_item_addons
        (order_item_id, addon_id, addon_name, addon_price)
      VALUES ($1, $2, $3, $4)
      RETURNING
        order_addon_id AS "orderAddonId",
        order_item_id  AS "orderItemId",
        addon_id       AS "addonId",
        addon_name     AS "addonName",
        addon_price    AS "addonPrice"
    `;
    const { rows } = await client.query(sql, [
      orderItemId,
      addonId,
      addonName,
      addonPrice,
    ]);
    return rows[0];
  }

  async createOrderPayment(client, orderId, paymentMethod, amount) {
    const sql = `
      INSERT INTO order_payments
        (order_id, payment_method, amount_paid)
      VALUES ($1, $2, $3)
      RETURNING
        payment_id     AS "paymentId",
        payment_method AS "paymentMethod",
        payment_status AS "paymentStatus",
        amount_paid    AS "amountPaid"
    `;
    const { rows } = await client.query(sql, [orderId, paymentMethod, amount]);
    return rows[0];
  }

  async createOrderInstruction(client, orderId, message) {
    // Inserts into order_instructions, not order_payments
    const sql = `
      INSERT INTO order_instructions
        (order_id, instruction_text)
      VALUES ($1, $2)
    `;
    await client.query(sql, [orderId, message]);
  }

  async clearCart(client, userId) {
    const sql = `
      DELETE FROM carts
      WHERE  customer_id = $1
    `;
    // cart_items and cart_item_addons are removed via ON DELETE CASCADE
    await client.query(sql, [userId]);
  }
}

export const appOrdersModel = new AppOrderModel();
