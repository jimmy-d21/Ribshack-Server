import db from "../../../config/db.js";

const SELECT_REQUEST = `
  SELECT
    ir.request_id                AS id,
    ir.priority_level            AS priority,
    ir.status,
    ir.branch_notes              AS notes,
    ir.created_at                AS "requestedAt",
    b.branch_id,
    b.branch_name                AS branch,

    (
      SELECT STRING_AGG(it.item_name, ', ')
      FROM inventory_request_items iri
      JOIN inventory_items it ON it.item_id = iri.item_id
      WHERE iri.request_id = ir.request_id
    ) AS "inventoryName",

    (
      SELECT JSON_AGG(JSON_BUILD_OBJECT(
        'requestItemId', iri.request_item_id,
        'itemId',        it.item_id,
        'item',          it.item_name,
        'quantity',      iri.quantity_requested,
        'unit',          it.unit_of_measure
      ))
      FROM inventory_request_items iri
      JOIN inventory_items it ON it.item_id = iri.item_id
      WHERE iri.request_id = ir.request_id
    ) AS items

  FROM inventory_requests ir
  JOIN branches b ON b.branch_id = ir.branch_id
`;

class AdminInventoryRequestModel {
  async findAll(status = null) {
    let sql = SELECT_REQUEST;
    const params = [];

    if (status) {
      sql += ` WHERE ir.status = $1`;
      params.push(status.toUpperCase());
    }

    sql += ` ORDER BY ir.created_at DESC`;
    const { rows } = await db.query(sql, params);
    return rows;
  }

  async findById(requestId, client = db) {
    const sql = SELECT_REQUEST + ` WHERE ir.request_id = $1`;
    const { rows } = await client.query(sql, [requestId]);
    return rows[0] ?? null;
  }

  async updateStatus(client, requestId, status) {
    await client.query(
      `UPDATE inventory_requests
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE request_id = $2`,
      [status, requestId],
    );

    const sql = SELECT_REQUEST + ` WHERE ir.request_id = $1`;
    const { rows } = await client.query(sql, [requestId]);
    return rows[0];
  }

  async createStatusLogs(client, requestId, status, adminId, remarks) {
    const sql = `
      INSERT INTO inventory_request_status_logs
        (request_id, status, actioned_by, remarks)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await client.query(sql, [
      requestId,
      status,
      adminId,
      remarks,
    ]);
    return rows[0];
  }

  async incrementItemQuantity(client, itemId, quantity) {
    const sql = `
      UPDATE inventory_items
      SET current_quantity = current_quantity + $1
      WHERE item_id = $2
      RETURNING item_id, item_name, current_quantity
    `;
    const { rows } = await client.query(sql, [quantity, itemId]);
    return rows[0];
  }

  async createNotification(client, branchId, title, message, type) {
    const sql = `
      INSERT INTO store_notifications
        (branch_id, title, message, notification_type)
      VALUES ($1, $2, $3, $4)
    `;
    await client.query(sql, [branchId, title, message, type]);
  }
}

export const adminInventoryRequestModel = new AdminInventoryRequestModel();
