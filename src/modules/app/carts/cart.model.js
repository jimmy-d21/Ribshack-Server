import db from "../../../config/db.js";

class AppCartModel {
  async findUserById(userId) {
    const sql = `SELECT
                    user_id AS id,
                    full_name AS "fullName",
                    email,
                    contact_number AS "contactNumber",
                    created_at AS "createdAt"
                 FROM users
                 WHERE user_id = $1`;
    const { rows } = await db.query(sql, [userId]);
    return rows[0];
  }

  async findAll(userId) {
    const sql = `SELECT
                    c.cart_id        AS "id",
                    c.created_at     AS "createdAt",
                    ci.cart_item_id  AS "cartItemId",
                    p.product_name   AS "name",
                    pi.image_url     AS "image",
                    ci.unit_price * ci.quantity AS "price",
                    ci.quantity      AS "quantity",
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
                    ) AS "addons"
                FROM carts c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN products p ON ci.product_id = p.product_id
                JOIN product_images pi ON p.product_id = pi.product_id
                    AND pi.is_primary = TRUE
                WHERE c.customer_id = $1
                ORDER BY c.created_at DESC`;
    const { rows } = await db.query(sql, [userId]);
    return rows;
  }
}

export const appCartModel = new AppCartModel();
