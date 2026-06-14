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

  async findBestSellingMenu(branchId) {
    const sql = `
        SELECT
          bm.branch_menu_id AS "menuId",
          bm.branch_id AS "branchId",
          p.product_id AS "id",
          p.product_name AS "name",
          p.description AS "description",
          p.base_price::float AS "price",
          (
            SELECT pi.image_url 
            FROM product_images pi 
            WHERE pi.product_id = p.product_id 
              AND pi.is_primary = TRUE 
            LIMIT 1
          ) AS "image", 
          p.has_unli_rice AS "includesUnliRice",
          bm.is_visible AS "available",
          
          -- Correlated Subquery replaces the need for GROUP BY
          COALESCE((
            SELECT SUM(oi.quantity)::int
            FROM order_items oi
            JOIN orders o ON o.order_id = oi.order_id
            WHERE oi.product_id = p.product_id
              AND o.branch_id = bm.branch_id
              AND o.order_status != 'CANCELLED'
          ), 0) AS "totalSold"

        FROM branch_menu bm
        JOIN products p ON p.product_id = bm.product_id
        WHERE bm.branch_id = $1
          AND bm.is_visible = TRUE
        ORDER BY "totalSold" DESC
        LIMIT 10`;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }

  async findAllCategories(branchId) {
    const sql = `
      SELECT DISTINCT
        pc.category_id AS "id",
        pc.category_name AS "name",
        (
          SELECT pi.image_url
          FROM product_images pi
          JOIN products p2 ON pi.product_id = p2.product_id
          JOIN branch_menu bm2 ON p2.product_id = bm2.product_id
          WHERE p2.category_id = pc.category_id
            AND bm2.branch_id = $1
            AND bm2.is_visible = TRUE
          ORDER BY pi.is_primary DESC
          LIMIT 1
        ) AS "imageUrl"
      FROM product_categories pc
      JOIN products p ON pc.category_id = p.category_id
      JOIN branch_menu bm ON p.product_id = bm.product_id
      WHERE bm.branch_id = $1 AND bm.is_visible = TRUE
      ORDER BY pc.category_name ASC`;

    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const appHomeModel = new AppHomeModel();
