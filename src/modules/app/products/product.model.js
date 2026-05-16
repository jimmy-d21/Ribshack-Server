import db from "../../../config/db.js";

class AppProductModel {
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
                    bm.is_visible AS "available",
                    COALESCE(
                        (
                            SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'id', pa.addon_id,
                                    'name', pa.addon_name,
                                    'price', pa.additional_price,
                                    'type', pa.addon_type
                                )
                            )
                            FROM product_addons pa
                            WHERE pa.product_id = p.product_id
                            AND pa.addon_type = 'drink' 
                            AND pa.is_active = TRUE
                        ), '[]'::json
                    ) AS drinks,
                    COALESCE(
                        (
                            SELECT JSON_AGG(
                                JSON_BUILD_OBJECT(
                                    'id', pa.addon_id,
                                    'name', pa.addon_name,
                                    'price', pa.additional_price,
                                    'type', pa.addon_type
                                )
                            )
                            FROM product_addons pa
                            WHERE pa.product_id = p.product_id
                            AND pa.addon_type = 'extra'
                            AND pa.is_active = TRUE
                        ), '[]'::json
                    ) AS extras                          
                FROM products p
                JOIN branch_menu bm ON p.product_id = bm.product_id
                JOIN product_categories pc ON p.category_id = pc.category_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
                WHERE bm.branch_menu_id = $1
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
                    p.description AS "description",
                    COALESCE(bm.price_override, p.base_price) AS "price",
                    pi.image_url AS "image",
                    p.has_unli_rice AS "includesUnliRice",
                    bm.is_visible AS "available"
                FROM products p
                JOIN branch_menu bm ON p.product_id = bm.product_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
                WHERE bm.branch_menu_id = $1
                AND p.is_active = TRUE`;
    const { rows } = await db.query(sql, [productId]);
    return rows[0];
  }
}

export const appProductModel = new AppProductModel();
