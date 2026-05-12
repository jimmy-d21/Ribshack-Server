import db from "../../../config/db.js";

class AdminAuthModel {
  static async findByEmail(email) {
    const { rows } = await db.query(`SELECT * FROM admins WHERE email = $1`, [
      email,
    ]);
    return rows[0];
  }
}

export default AdminAuthModel;
