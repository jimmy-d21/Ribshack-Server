import db from "../../../config/db.js";

class StoreAuthModel {
  async findByUsername(username) {
    const sql = `SELECT
                    b.branch_id AS id,
                    b.branch_name AS name,
                    b.full_address AS location,
                    b.city,
                    br.region_id,
                    br.region_name AS region,
                    b.manager_name AS manager,
                    b.contact_number AS phone,
                    b.password_hash AS password,
                    b.username,
                    b.is_open AS status,
                    b.created_at
                FROM branches b
                JOIN branches_regions br ON b.region_id = br.region_id
                WHERE b.username = $1`;
    const { rows } = await db.query(sql, [username]);
    return rows[0];
  }

  async findById(branchId) {
    const sql = `SELECT
                    b.branch_id AS id,
                    b.branch_name AS name,
                    b.full_address AS location,
                    b.city,
                    br.region_id,
                    br.region_name AS region,
                    b.manager_name AS manager,
                    b.contact_number AS phone,
                    b.username,
                    b.is_open AS status,
                    b.created_at
                FROM branches b
                JOIN branches_regions br ON b.region_id = br.region_id
                WHERE b.branch_id = $1`;
    const { rows } = await db.query(sql, [branchId]);
    return rows[0];
  }
}

export const storeAuthModel = new StoreAuthModel();
