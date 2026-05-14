import db from "../../../config/db.js";

class AdminProductModel {
  // TODO: get the popular using where clause based on order
  async findAll() {
    const sql = `SELECT
                    p.product_id        AS id,
                    p.product_name      AS name,
                    pc.category_name    AS category,
                    p.base_price        AS price,
                    p.description,
                    p.has_unli_rice     AS "unliRice",
                    p.is_active         AS available,
                    pi.image_url        AS image
                FROM products p
                JOIN  product_categories pc ON p.category_id  = pc.category_id 
                LEFT JOIN product_images pi ON p.product_id   = pi.product_id        
                ORDER BY p.created_at DESC`;
    const { rows } = await db.query(sql);
    return rows;
  }
}

export const adminProductModel = new AdminProductModel();
