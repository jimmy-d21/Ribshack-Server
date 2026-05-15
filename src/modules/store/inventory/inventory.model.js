import db from "../../../config/db.js";

class StoreInventoryModel {
  async findAll(branchId) {
    const sql = `SELECT
                    item_id AS id,
                    item_name AS itemName,
                    item_type AS itemType,
                    current_quantity AS currentStock,
                    reorder_threshold AS minimumThreshold,
                    unit_of_measure AS unit,
                    CASE 
                        WHEN current_quantity <= (reorder_threshold * 0.50) THEN 'Critical'
                        WHEN current_quantity <= (reorder_threshold * 0.80) THEN 'Low'
                        ELSE 'Adequate'
                    END AS status
                FROM inventory_items
                WHERE branch_id = $1`;
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

  async findAllCritical(branchId) {
    const sql = `SELECT
                    item_id AS id,
                    item_name AS itemName,
                    item_type AS itemType,
                    current_quantity AS currentStock,
                    reorder_threshold AS minimumThreshold,
                    unit_of_measure AS unit,
                    CASE 
                        WHEN current_quantity <= (reorder_threshold * 0.50) THEN 'Critical'
                        WHEN current_quantity <= (reorder_threshold * 0.80) THEN 'Low'
                        ELSE 'Adequate'
                    END AS status
                FROM inventory_items
                WHERE branch_id = $1 AND current_quantity <= (reorder_threshold * 0.50)`;
    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const storeInventoryModel = new StoreInventoryModel();
