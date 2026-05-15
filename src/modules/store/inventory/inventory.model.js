import db from "../../../config/db.js";

class StoreInventoryModel {
  async findAll(branchId, { criticalOnly = false } = {}) {
    const sql = `SELECT
                    item_id AS id,
                    branch_id AS branchId,
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
                WHERE branch_id = $1
                ${criticalOnly ? "AND current_quantity <= (reorder_threshold * 0.50)" : ""}`;
    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }

  async findById(inventoryId) {
    const sql = `SELECT
                  item_id AS id,
                  branch_id AS "branchId",
                  item_name AS "itemName",
                  item_type AS "itemType",
                  current_quantity AS "currentStock",
                  reorder_threshold AS "minimumThreshold",
                  max_threshold AS "maximumThreshold",
                  unit_of_measure AS unit,
                  CASE 
                      WHEN current_quantity <= (reorder_threshold * 0.50) THEN 'Critical'
                      WHEN current_quantity <= (reorder_threshold * 0.80) THEN 'Low'
                      ELSE 'Adequate'
                  END AS status
              FROM inventory_items
              WHERE item_id = $1`;
    const { rows } = await db.query(sql, [inventoryId]);
    return rows[0];
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

  async create(branchId, inventoryData) {
    const {
      itemName,
      itemType,
      currentStock,
      minimumThreshold,
      maximumThreshold,
      unit,
    } = inventoryData;

    const sql = `INSERT INTO inventory_items
               (branch_id, item_name, item_type, current_quantity, reorder_threshold, max_threshold, unit_of_measure)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING 
                  item_id AS id,
                  item_name AS "itemName",
                  item_type AS "itemType",
                  current_quantity AS "currentStock",
                  reorder_threshold AS "minimumThreshold",
                  max_threshold AS "maximumThreshold",
                  unit_of_measure AS unit,
                  CASE 
                      WHEN current_quantity <= (reorder_threshold * 0.50) THEN 'Critical'
                      WHEN current_quantity <= (reorder_threshold * 0.80) THEN 'Low'
                      ELSE 'Adequate'
                  END AS status`;

    const values = [
      branchId,
      itemName,
      itemType,
      currentStock,
      minimumThreshold,
      maximumThreshold,
      unit,
    ];
    const { rows } = await db.query(sql, values);
    return rows[0];
  }

  async findByItemName(branchId, itemName) {
    const sql = `SELECT item_id 
               FROM inventory_items
               WHERE branch_id = $1 
               AND LOWER(item_name) = LOWER($2)`;
    const { rows } = await db.query(sql, [branchId, itemName]);
    return rows[0];
  }

  async findByIdAndUpdate(inventoryId, inventoryData) {
    const {
      itemName,
      itemType,
      currentStock,
      minimumThreshold,
      maximumThreshold,
      unit,
    } = inventoryData;

    const sql = `UPDATE inventory_items
                  SET item_name = $1, item_type = $2, current_quantity = $3, 
                      reorder_threshold = $4, max_threshold = $5, unit_of_measure = $6
                  WHERE item_id = $7
                  RETURNING
                      item_id AS id,
                      branch_id AS "branchId",
                      item_name AS "itemName",
                      item_type AS "itemType",
                      current_quantity AS "currentStock",
                      reorder_threshold AS "minimumThreshold",
                      max_threshold AS "maximumThreshold",
                      unit_of_measure AS unit,
                      CASE 
                          WHEN current_quantity <= (reorder_threshold * 0.50) THEN 'Critical'
                          WHEN current_quantity <= (reorder_threshold * 0.80) THEN 'Low'
                          ELSE 'Adequate'
                      END AS status`;

    const values = [
      itemName,
      itemType,
      currentStock,
      minimumThreshold,
      maximumThreshold,
      unit,
      inventoryId,
    ];
    const { rows } = await db.query(sql, values);
    return rows[0];
  }

  async findByIdAndDelete(inventoryId) {
    const sql = `DELETE FROM inventory_items
               WHERE item_id = $1
               RETURNING
                  item_id AS id,
                  item_name AS "itemName",
                  item_type AS "itemType",
                  current_quantity AS "currentStock",
                  reorder_threshold AS "minimumThreshold",
                  max_threshold AS "maximumThreshold",
                  unit_of_measure AS unit`;
    const { rows } = await db.query(sql, [inventoryId]);
    return rows[0];
  }
}

export const storeInventoryModel = new StoreInventoryModel();
