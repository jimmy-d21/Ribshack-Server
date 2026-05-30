import db from "../../../config/db.js";

class AppProductModel {
  // returns product details only — no addons
  async findDetailsById(productId) {
    const sql = `SELECT
                    bm.branch_menu_id AS "menuId",
                    bm.branch_id AS "branchId",
                    p.product_id AS "id",
                    p.product_name AS "name",
                    p.description AS "description",
                    pc.category_name AS "category",
                    COALESCE(bm.price_override, p.base_price) AS "price",
                    pi.image_url AS "image",
                    p.has_unli_rice AS "includesUnliRice",
                    bm.is_visible AS "available"
                FROM products p
                JOIN branch_menu bm ON p.product_id = bm.product_id
                JOIN product_categories pc ON p.category_id = pc.category_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
                WHERE p.product_id = $1
                AND p.is_active = TRUE`;
    const { rows } = await db.query(sql, [productId]);
    return rows[0];
  }

  async findById(productId) {
    const sql = `SELECT
                    bm.branch_menu_id AS "menuId",
                    bm.branch_id AS "branchId",
                    p.product_id AS "id",
                    p.product_name AS "name",
                    COALESCE(bm.price_override, p.base_price) AS "price",
                    p.has_unli_rice AS "includesUnliRice",
                    bm.is_visible AS "available"
                FROM products p
                JOIN branch_menu bm ON p.product_id = bm.product_id
                WHERE p.product_id = $1
                AND p.is_active = TRUE`;
    const { rows } = await db.query(sql, [productId]);
    return rows[0];
  }

  async findAddonsByProductId(productId) {
    const sql = `SELECT
                    addon_id AS "id",
                    addon_name AS "name",
                    additional_price AS "price",
                    addon_type AS "type"
                FROM product_addons
                WHERE product_id = $1
                AND is_active = TRUE
                ORDER BY addon_type, addon_name`;
    const { rows } = await db.query(sql, [productId]);

    return {
      drinks: rows.filter((addon) => addon.type === "drink"),
      extras: rows.filter((addon) => addon.type === "extra"),
    };
  }
}

export const appProductModel = new AppProductModel();
