import db from "../../../config/db.js";

class StoreNotificationModel {
  async findAll(branchId) {
    const sql = `SELECT
                        notification_id         AS id,
                        notification_type       AS type,
                        title,
                        message,
                        is_read                 AS isRead,
                        created_at              AS createdAt
                FROM store_notifications
                WHERE branch_id = $1
                        `;
    const { rows } = await db.query(sql, [branchId]);
    return rows;
  }
}

export const storeNotificationModel = new StoreNotificationModel();
