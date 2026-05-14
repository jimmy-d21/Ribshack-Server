import db from "../../../config/db.js";

class AdminProductModel {
  // Todo: provide a best seller based on total orders
  async findAll() {
    const sql = `
      SELECT
        p.product_id AS id,
        p.product_name AS name,
        pc.category_name AS category,
        p.base_price AS price,
        p.description,
        p.has_unli_rice AS "unliRice",
        p.is_active AS available,
        pi.image_url AS image,
        (
          SELECT COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', pa.addon_id,
                'name', pa.addon_name,
                'price', pa.additional_price
              )
            ),
            '[]'
          )
          FROM product_addons pa
          WHERE pa.product_id = p.product_id
          AND pa.is_active = TRUE
        ) AS addons
      FROM products p
      JOIN product_categories pc ON p.category_id = pc.category_id
      LEFT JOIN product_images pi
        ON p.product_id = pi.product_id
        AND pi.is_primary = TRUE
      ORDER BY p.created_at DESC
    `;
    const { rows } = await db.query(sql);
    return rows;
  }

  async findCategoryByName(client, name) {
    const { rows } = await client.query(
      `SELECT * FROM product_categories WHERE LOWER(category_name) = LOWER($1)`,
      [name],
    );
    return rows[0];
  }

  async createCategory(client, name) {
    const { rows } = await client.query(
      `INSERT INTO product_categories (category_name) VALUES ($1) RETURNING *`,
      [name],
    );
    return rows[0];
  }

  async create(client, data) {
    const sql = `
      INSERT INTO products (product_name, base_price, description, category_id, has_unli_rice, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.name,
      data.price,
      data.description,
      data.categoryId,
      data.unliRice,
      data.available,
    ];
    const { rows } = await client.query(sql, values);
    return rows[0];
  }

  async createImage(client, productId, imageUrl) {
    const sql = `INSERT INTO product_images (product_id, image_url, is_primary) VALUES ($1, $2, TRUE)`;
    await client.query(sql, [productId, imageUrl]);
  }

  async createAddOns(client, productId, addonName, additionalPrice) {
    const sql = `INSERT INTO product_addons (product_id, addon_name, additional_price) VALUES ($1, $2, $3)`;
    await client.query(sql, [productId, addonName, additionalPrice]);
  }

  async findById(client = db, productId) {
    const sql = `
      SELECT
        p.product_id AS id,
        p.product_name AS name,
        pc.category_name AS category,
        p.category_id AS category_id,
        p.base_price AS price,
        p.description,
        p.has_unli_rice AS "unliRice",
        p.is_active AS available,
        pi.image_url AS image,
        (
          SELECT COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', pa.addon_id,
                'name', pa.addon_name,
                'price', pa.additional_price
              )
            ),
            '[]'
          )
          FROM product_addons pa
          WHERE pa.product_id = p.product_id
          AND pa.is_active = TRUE
        ) AS addons
      FROM products p
      JOIN product_categories pc ON p.category_id = pc.category_id
      LEFT JOIN product_images pi
        ON p.product_id = pi.product_id
        AND pi.is_primary = TRUE
      WHERE p.product_id = $1
    `;
    const { rows } = await client.query(sql, [productId]);
    return rows[0];
  }

  async update(client, productId, data) {
    const sql = `
      UPDATE products 
      SET product_name = $1, base_price = $2, description = $3, 
          category_id = $4, has_unli_rice = $5, is_active = $6, 
          updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $7 RETURNING *`;
    const values = [
      data.name,
      data.price,
      data.description,
      data.categoryId,
      data.unliRice,
      data.available,
      productId,
    ];
    const { rows } = await client.query(sql, values);
    return rows[0];
  }

  async updateImage(client, productId, imageUrl) {
    const sql = `UPDATE product_images SET image_url = $1 WHERE product_id = $2 AND is_primary = TRUE`;
    await client.query(sql, [imageUrl, productId]);
  }

  async deleteAllAddOns(client, productId) {
    await client.query("DELETE FROM product_addons WHERE product_id = $1", [
      productId,
    ]);
  }

  async delete(client, productId) {
    const sql = `DELETE FROM products WHERE product_id = $1 RETURNING *`;
    const { rows } = await client.query(sql, [productId]);
    return rows[0];
  }

  async updateAvailability(client, productId, available) {
    const sql = `UPDATE products SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE product_id = $2 RETURNING *`;
    const { rows } = await client.query(sql, [available, productId]);
    return rows[0];
  }

  async createBranchProduct(client, branchId, productId) {
    const sql = `INSERT INTO branch_menu (branch_id, product_id) VALUES($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
    const { rows } = await client.query(sql, [branchId, productId]);
    return rows[0];
  }

  async upsertBranchAvailability(client, branchId, productId, isAvailable) {
    const sql = `
      INSERT INTO branch_product_availability (branch_id, product_id, is_available, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (branch_id, product_id) 
      DO UPDATE SET is_available = EXCLUDED.is_available, updated_at = CURRENT_TIMESTAMP`;
    await client.query(sql, [branchId, productId, isAvailable]);
  }

  async upsertBranchMenu(client, branchId, productId, isVisible) {
    const sql = `
      INSERT INTO branch_menu (branch_id, product_id, is_visible)
      VALUES ($1, $2, $3)
      ON CONFLICT (branch_id, product_id) 
      DO UPDATE SET is_visible = EXCLUDED.is_visible`;
    await client.query(sql, [branchId, productId, isVisible]);
  }
}

export const adminProductModel = new AdminProductModel();
