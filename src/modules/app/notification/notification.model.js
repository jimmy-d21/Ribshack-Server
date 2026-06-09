import db from "../../../config/db.js";

class AppNotificationModel {
  async findAll(userId) {
    const sql = `SELECT
                        notification_id         AS id,
                        notification_type       AS type,
                        title,
                        message,
                        is_read                 AS isRead,
                        created_at              AS createdAt
                FROM app_notifications
                WHERE customer_id = $1
                ORDER BY created_at DESC
                        `;
    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findByIdAndUpdate(notificationId) {
    const sql = `UPDATE app_notifications
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

  async markAllAsRead(userId) {
    const sql = `UPDATE app_notifications
                 SET is_read = TRUE
                 WHERE customer_id = $1
                       AND is_read = FALSE`;
    await db.query(sql, [userId]);
  }

  async findById(notificationId) {
    const sql = `SELECT EXISTS(FROM app_notifications WHERE notification_id = $1)`;
    const { rows } = await db.query(sql, [notificationId]);
    return rows[0].exists;
  }

  async findByIdAndDelete(notificationId) {
    const sql = `DELETE FROM app_notifications 
                 WHERE notification_id = $1`;
    await db.query(sql, [notificationId]);
  }

  async deleteAll(userId) {
    const sql = `DELETE FROM app_notifications 
                 WHERE customer_id = $1`;
    await db.query(sql, [userId]);
  }
}

export const appNotificationModel = new AppNotificationModel();
