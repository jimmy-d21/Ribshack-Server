import db from "../../../config/db.js";

class AdminInventoryRequestModel {
  static async findAll(status = null) {
    let sql = `SELECT 
                    ir.request_id,
                    ir.priority_level,
                    ir.status,
                    ir.branch_notes,
                    ir.created_at,
                    b.branch_id,
                    b.branch_name,
                    (
                        SELECT JSON_AGG(JSON_BUILD_OBJECT(
                            'request_item_id', iri.request_item_id,
                            'item_id', it.item_id,
                            'item_name', it.item_name,
                            'quantity_requested', iri.quantity_requested
                        ))
                        FROM inventory_request_items iri
                        JOIN inventory_items it ON iri.item_id = it.item_id
                        WHERE iri.request_id = ir.request_id
                    ) AS items_list
                FROM inventory_requests ir
                JOIN branches b ON ir.branch_id = b.branch_id
                `;
    const params = [];
    if (status) {
      sql += ` WHERE ir.status = $1`;
      params.push(status.toUpperCase());
    }

    sql += ` ORDER BY ir.created_at DESC`;
    const { rows } = await db.query(sql, params);
    return rows;
  }
}

export default AdminInventoryRequestModel;
