import db from "../../../config/db.js";

class StoreAuthModel {
  async findByUsername(username) {
    const sql = `SELECT * FROM branches WHERE username = $1`;
    const { rows } = await db.query(sql, [username]);
    return rows[0];
  }
}

export const storeAuthModel = new StoreAuthModel();
