import db from "../../../config/db.js";

class AppCartModel {
  async findAll(userId) {
    const sql = `
      SELECT
        c.cart_id                   AS "id",
        c.created_at                AS "createdAt",
        ci.cart_item_id             AS "cartItemId",
        p.product_name              AS "name",
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
    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findCartItem(client = db, cartItemId) {
    const sql = `
      SELECT
        c.cart_id                   AS "id",
        c.created_at                AS "createdAt",
        ci.cart_item_id             AS "cartItemId",
        p.product_name              AS "name",
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
      WHERE ci.cart_item_id = $1
    `;
    const { rows } = await client.query(sql, [cartItemId]);
    return rows[0] ?? null;
  }

  async findCartByUserId(client = db, userId) {
    const sql = `
      SELECT cart_id, customer_id, branch_id
      FROM   carts
      WHERE  customer_id = $1
    `;
    const { rows } = await client.query(sql, [userId]);
    return rows[0] ?? null;
  }

  async createCart(client, userId, branchId) {
    const sql = `
      INSERT INTO carts (customer_id, branch_id)
      VALUES ($1, $2)
      RETURNING cart_id, customer_id, branch_id
    `;
    const { rows } = await client.query(sql, [userId, branchId]);
    return rows[0];
  }

  async createCartItem(client, { cartId, productId, quantity, unitPrice }) {
    const sql = `
      INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
      VALUES ($1, $2, $3, $4)
      RETURNING cart_item_id, cart_id, product_id, quantity, unit_price
    `;
    const { rows } = await client.query(sql, [
      cartId,
      productId,
      quantity,
      unitPrice,
    ]);
    return rows[0];
  }

  async updateCartItem(client, cartItemId, { quantity, unitPrice }) {
    const sql = `
      UPDATE cart_items
      SET    quantity   = $1,
             unit_price = $2,
             updated_at = CURRENT_TIMESTAMP
      WHERE  cart_item_id = $3
      RETURNING cart_item_id, cart_id, product_id, quantity, unit_price
    `;
    const { rows } = await client.query(sql, [quantity, unitPrice, cartItemId]);
    return rows[0];
  }

  async deleteAllAddons(client, cartItemId) {
    const sql = `
      DELETE FROM cart_item_addons
      WHERE  cart_item_id = $1
      RETURNING *
    `;
    // return rows (all deleted), not just rows[0]
    const { rows } = await client.query(sql, [cartItemId]);
    return rows;
  }

  async createCartAddon(
    client,
    cartItemId,
    { addonId, addonName, addonPrice },
  ) {
    const sql = `
      INSERT INTO cart_item_addons (cart_item_id, addon_id, addon_name, addon_price)
      VALUES ($1, $2, $3, $4)
      RETURNING cart_addon_id, cart_item_id, addon_id, addon_name, addon_price
    `;
    const { rows } = await client.query(sql, [
      cartItemId,
      addonId,
      addonName,
      addonPrice,
    ]);
    return rows[0];
  }
}

export const appCartModel = new AppCartModel();
