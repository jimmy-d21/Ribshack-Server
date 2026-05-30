import db from "../../../config/db.js";

class AppBranchModel {
  async findAll(location) {
    const sql = `
      SELECT
        b.branch_id AS "id",
        b.branch_name AS "name",
        b.full_address AS "address",
        b.city,
        br.region_name AS region,
        b.manager_name AS "manager",
        b.contact_number AS "contactNumber",
        b.is_open        AS "isOpen",
        b.created_at AS "createdAt"
      FROM branches b
      JOIN branches_regions br ON b.region_id = br.region_id
      WHERE b.is_open = TRUE 
      AND b.city ILIKE $1`;

    const searchTerm = `%${location}%`;

    const { rows } = await db.query(sql, [searchTerm]);
    return rows;
  }

  async findById(branchId) {
    const sql = `
      SELECT
        b.branch_id AS "id",
        b.branch_name AS "name",
        b.full_address AS "address",
        b.city,
        br.region_name AS region,
        b.manager_name AS "manager",
        b.contact_number AS "contactNumber",
        b.is_open,
        b.created_at AS "createdAt"
      FROM branches b
      JOIN branches_regions br ON b.region_id = br.region_id
      WHERE b.branch_id = $1`;

    const { rows } = await db.query(sql, [branchId]);
    return rows[0];
  }

  async findAllBranchMenu(branchId, category = null) {
    let sql = `SELECT 
              p.product_id AS "id",
              bm.branch_id AS "branchId",
              bm.branch_menu_id AS "menuId",
              p.product_name AS "name",
              pc.category_name AS "category",
              p.description AS "description",
              p.base_price AS "price",
              pi.image_url AS "image",
              p.has_unli_rice AS "includesUnliRice",
              bm.is_visible AS "available"
            FROM products p
            JOIN branch_menu bm ON p.product_id = bm.product_id
            JOIN product_categories pc ON p.category_id = pc.category_id
            LEFT JOIN product_images pi 
              ON p.product_id = pi.product_id 
              AND pi.is_primary = TRUE
            WHERE bm.branch_id = $1
            `;

    const queryParams = [branchId];

    if (category) {
      queryParams.push(category);
      sql += ` AND pc.category_name = $2 `;
    }

    sql += ` ORDER BY pc.display_order ASC, p.product_name ASC`;

    const { rows } = await db.query(sql, queryParams);
    return rows;
  }
}

export const appBranchModel = new AppBranchModel();
