import db from "../../../config/db.js";

class AdminAuthModel {
  async findByEmail(email) {
    const { rows } = await db.query(`SELECT * FROM admins WHERE email = $1`, [
      email,
    ]);
    return rows[0];
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT * FROM admins WHERE admin_id = $1`,
      [id],
    );
    return rows[0];
  }
}

export const adminAuthModel = new AdminAuthModel();
