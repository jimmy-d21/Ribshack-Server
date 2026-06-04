import db from "../../../config/db.js";

class AdminAuthModel {
  async findByEmail(email) {
    const { rows } = await db.query(
      `SELECT
        admin_id AS id,
        full_name AS fullName,
        email,
        password_hash AS password, 
        contact_number AS contactNumber,
        is_active AS isActive,
        created_at AS createdAt 
       FROM admins 
       WHERE email = $1`,
      [email],
    );
    return rows[0];
  }

  async findById(id) {
    const { rows } = await db.query(
      `SELECT 
        admin_id AS id, 
        full_name AS fullName, 
        email, 
        contact_number AS contactNumber, 
        is_active AS isActive, 
        created_at AS createdAt 
       FROM admins 
       WHERE admin_id = $1`,
      [id],
    );
    return rows[0];
  }
}

export const adminAuthModel = new AdminAuthModel();
