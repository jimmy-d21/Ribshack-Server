import db from "../../../config/db.js";

class AppBranchModel {
  async findAll(location) {
    const sql = `
      SELECT
        b.branch_id AS "id",
        b.branch_name AS "name",
        b.full_address AS "address",
        b.city,
        br.region_name AS region,
        b.manager_name AS "manager",
        b.contact_number AS "contactNumber",
        b.is_open,
        b.created_at AS "createdAt"
      FROM branches b
      JOIN branches_regions br ON b.region_id = br.region_id
      WHERE b.is_open = TRUE 
      AND b.city ILIKE $1`;

    const searchTerm = `%${location}%`;

    const { rows } = await db.query(sql, [searchTerm]);
    return rows;
  }
}

export const appBranchModel = new AppBranchModel();
