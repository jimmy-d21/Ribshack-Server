import db from "../../../config/db.js";

class AppHomeModel {
  async findBranchById(branchId) {
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

  // Todo: get this based on orders
  async findBestSellingMenu(branchId) {
    const sql = `SELECT
                    bm.branch_id AS "branchId",
                    p.product_id AS "id",
                    p.product_name AS "name",
                    p.description AS "description",
                    p.base_price AS "price",
                    pi.image_url AS "image",
                    p.has_unli_rice AS "includesUnliRice",
                    bm.is_visible AS "available"
                FROM products p
                JOIN branch_menu bm ON p.product_id = bm.product_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id AND pi.is_primary = TRUE
                WHERE bm.branch_id = $1 
                AND bm.is_visible = TRUE 
                LIMIT 10`;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const appHomeModel = new AppHomeModel();
