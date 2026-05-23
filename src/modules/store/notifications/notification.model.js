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

  async findByIdAndUpdate(notificationId) {
    const sql = `UPDATE store_notifications
                 SET is_read = TRUE
                 WHERE notification_id = $1
                 RETURNING
                        notification_id         AS id,
                        notification_type       AS type,
                        title,
                        message,
                        is_read                 AS isRead,
                        created_at              AS createdAt`;
    const { rows } = await db.query(sql, [notificationId]);
    return rows[0];
  }

  async markAllAsRead(branchId) {
    const sql = `UPDATE store_notifications
                 SET is_read = TRUE
                 WHERE branch_id = $1
                       AND is_read = FALSE`;
    await db.query(sql, [branchId]);
  }

  async findById(notificationId) {
    const sql = `SELECT EXISTS(FROM store_notifications WHERE notification_id = $1)`;
    const { rows } = await db.query(sql, [notificationId]);
    return rows[0].exists;
  }

  async findByIdAndDelete(notificationId) {
    const sql = `DELETE FROM store_notifications 
                 WHERE notification_id = $1`;
    await db.query(sql, [notificationId]);
  }

  async deleteAll(branchId) {
    const sql = `DELETE FROM store_notifications 
                 WHERE branch_id = $1`;
    await db.query(sql, [branchId]);
  }
}

export const storeNotificationModel = new StoreNotificationModel();
