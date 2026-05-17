import db from "../../../config/db.js";

class AdminBranchesModel {
  async findAll() {
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
                  b.created_at,
                  JSON_BUILD_OBJECT(
                    'total_revenue', COALESCE(
                      (
                        SELECT SUM(o.total_amount)
                        FROM orders o
                        WHERE o.placed_at::date = CURRENT_DATE 
                          AND o.branch_id = b.branch_id
                          AND o.order_status != 'CANCELLED' 
                      ), 0.00
                    ),
                    'orders_today', (
                      SELECT COUNT(*)
                      FROM orders o  
                      WHERE o.placed_at::date = CURRENT_DATE 
                        AND o.branch_id = b.branch_id
                    )
                  ) AS branch_details
                FROM branches b
                JOIN branches_regions br ON b.region_id = br.region_id
                ORDER BY b.created_at DESC`;
    const { rows } = await db.query(sql);
    return rows;
  }

  async findRegionByName(region_name) {
    const { rows } = await db.query(
      "SELECT * FROM branches_regions WHERE LOWER(region_name) = LOWER($1)",
      [region_name],
    );
    return rows[0] || null;
  }

  async findByUsername(username) {
    const { rows } = await db.query(
      "SELECT branch_id FROM branches WHERE username = $1",
      [username],
    );
    return rows[0] || null;
  }

  async create(branchData) {
    const {
      name,
      location,
      city,
      region_id,
      manager,
      phone,
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
      name,
      location,
      city,
      region_id,
      manager,
      phone,
      username,
      password_hash,
    ]);

    return rows[0];
  }

  async findById(branchId) {
    const sql = `
      SELECT
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
      WHERE b.branch_id = $1
    `;
    const { rows } = await db.query(sql, [branchId]);
    return rows[0] || null;
  }

  async update(branchId, branchData) {
    const {
      name,
      location,
      city,
      status,
      manager,
      phone,
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
        name,
        location,
        city,
        status,
        manager,
        phone,
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
        name,
        location,
        city,
        status,
        manager,
        phone,
        username,
        branchId,
      ]);
      return rows[0];
    }
  }

  async deleteById(id) {
    const sql = `DELETE FROM branches WHERE branch_id = $1`;
    const result = await db.query(sql, [id]);
    return result.rowCount > 0;
  }

  async updateStatus(client, branchId, isOpen) {
    const sql = `
      UPDATE branches
      SET is_open = $1, updated_at = CURRENT_TIMESTAMP
      WHERE branch_id = $2
      RETURNING
        branch_id, branch_name, is_open, manager_name, updated_at
    `;
    const { rows } = await client.query(sql, [isOpen, branchId]);
    return rows[0];
  }

  async createStatusLogs(client, branchId, statusText) {
    const sql = `
      INSERT INTO branch_status_logs (branch_id, status)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await client.query(sql, [branchId, statusText]);
    return rows[0];
  }
}

export const adminBranchesModel = new AdminBranchesModel();
