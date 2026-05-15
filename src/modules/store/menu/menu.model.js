import db from "../../../config/db.js";

class StoreMenuModel {
  async findAll(branchId) {
    const sql = `SELECT
                    bm.branch_menu_id AS id,
                    p.product_id AS "productCode",
                    p.product_name AS "productName",
                    pc.category_name AS category,
                    p.base_price AS "basePrice",
                    p.has_unli_rice AS "includesUnliRice",
                    p.is_active AS "isActive",
                    pi.image_url AS "imageUrl",
                    JSON_BUILD_OBJECT(
                        'isAvailable', bm.is_visible,
                        'unavailableReason', null
                    ) AS availability
                FROM branch_menu AS bm
                JOIN products AS p ON bm.product_id = p.product_id
                JOIN product_categories AS pc ON p.category_id = pc.category_id
                JOIN product_images AS pi ON p.product_id = pi.product_id
                WHERE bm.branch_id = $1 AND p.is_active = TRUE
                ORDER BY bm.created_at DESC`;
    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }

  async findBranchById(branchId) {
    const sql = `SELECT
                    b.branch_id AS id,
                    b.branch_name AS name,
                    b.full_address AS location,
                    b.city,
                    br.region_id,
                    br.region_name AS region,
                    b.manager_name AS manager,
                    b.contact_number AS phone,
                    b.username,
                    b.is_open AS status,
                    b.created_at
                FROM branches b
                JOIN branches_regions br ON b.region_id = br.region_id
                WHERE b.branch_id = $1`;
    const { rows } = await db.query(sql, [branchId]);
    return rows[0];
  }
}

export const storeMenuModel = new StoreMenuModel();
