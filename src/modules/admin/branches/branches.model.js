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

  static async findById(branchId) {
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
      b.password_hash,
      b.is_open,
      b.created_at
    FROM branches b
    JOIN branches_regions br ON b.region_id = br.region_id
    WHERE b.branch_id = $1
  `;
    const { rows } = await db.query(sql, [branchId]);
    return rows[0] || null;
  }

  static async update(branchId, branchData) {
    const {
      branch_name,
      full_address,
      city,
      is_open,
      manager_name,
      contact_number,
      username,
      password_hash,
    } = branchData;

    if (password_hash) {
      const sql = `
      UPDATE branches
      SET
        branch_name    = $1,
        full_address   = $2,
        city           = $3,
        is_open        = $4,
        manager_name   = $5,
        contact_number = $6,
        username       = $7,
        password_hash  = $8,
        updated_at     = CURRENT_TIMESTAMP
      WHERE branch_id  = $9
      RETURNING
        branch_id, branch_name, full_address, city,
        is_open, manager_name, contact_number, username, updated_at
    `;
      const { rows } = await db.query(sql, [
        branch_name,
        full_address,
        city,
        is_open,
        manager_name,
        contact_number,
        username,
        password_hash,
        branchId,
      ]);
      return rows[0];
    } else {
      const sql = `
      UPDATE branches
      SET
        branch_name    = $1,
        full_address   = $2,
        city           = $3,
        is_open        = $4,
        manager_name   = $5,
        contact_number = $6,
        username       = $7,
        updated_at     = CURRENT_TIMESTAMP
      WHERE branch_id  = $8
      RETURNING
        branch_id, branch_name, full_address, city,
        is_open, manager_name, contact_number, username, updated_at
    `;
      const { rows } = await db.query(sql, [
        branch_name,
        full_address,
        city,
        is_open,
        manager_name,
        contact_number,
        username,
        branchId,
      ]);
      return rows[0];
    }
  }

  static async deleteById(id) {
    const sql = `DELETE FROM branches WHERE branch_id = $1`;
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }
}

export default AdminBranchesModel;
