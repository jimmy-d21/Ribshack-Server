// branches.model.js
import db from "../../../config/db.js";

class AdminBranchesModel {
  static async findAll() {
    const sql = `
      SELECT
        b.branch_id,
        b.branch_name,
        b.full_address,
        b.city,
        br.region_id,
        br.region_name,
        b.manager_name,
        b.contact_number,
        b.username,
        b.is_open,
        b.created_at
      FROM branches b
      JOIN branches_regions br ON b.region_id = br.region_id
      ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(sql);
    return rows;
  }
}

export default AdminBranchesModel;
