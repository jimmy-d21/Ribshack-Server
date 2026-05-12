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

  static async findRegionByName(region_name) {
    const { rows } = await db.query(
      "SELECT * FROM branches_regions WHERE LOWER(region_name) = LOWER($1)",
      [region_name],
    );
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const { rows } = await db.query(
      "SELECT branch_id FROM branches WHERE username = $1",
      [username],
    );
    return rows[0] || null;
  }

  static async create(branchData) {
    const {
      branch_name,
      full_address,
      city,
      region_id,
      manager_name,
      contact_number,
      username,
      password_hash,
    } = branchData;

    const sql = `
      INSERT INTO branches
        (branch_name, full_address, city, region_id, manager_name, contact_number, username, password_hash)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        branch_id, branch_name, full_address, city, region_id,
        manager_name, contact_number, username, is_open, created_at
    `;

    const { rows } = await db.query(sql, [
      branch_name,
      full_address,
      city,
      region_id,
      manager_name,
      contact_number,
      username,
      password_hash,
    ]);

    return rows[0];
  }
}

export default AdminBranchesModel;
