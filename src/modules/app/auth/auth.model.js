import db from "../../../config/db.js";

class AppAuthModel {
  async findByEmail(email) {
    const sql = `SELECT user_id, email
                 FROM users
                 WHERE email = $1`;
    const { rows } = await db.query(sql, [email]);
    return rows[0];
  }

  async findByEmailWithPassword(email) {
    const sql = `SELECT
                    user_id AS id,
                    full_name AS "fullName",
                    email,
                    contact_number AS "contactNumber",
                    password_hash AS password,
                    created_at AS "createdAt"
                 FROM users
                 WHERE email = $1`;
    const { rows } = await db.query(sql, [email]);
    return rows[0];
  }

  async findById(userId) {
    const sql = `SELECT
                    user_id AS id,
                    full_name AS "fullName",
                    email,
                    contact_number AS "contactNumber",
                    created_at AS "createdAt"
                 FROM users
                 WHERE user_id = $1`;
    const { rows } = await db.query(sql, [userId]);
    return rows[0];
  }

  async createAccount(userData) {
    const { fullName, email, password, contactNumber } = userData;
    const sql = `INSERT INTO users
                 (full_name, email, password_hash, contact_number)
                 VALUES($1, $2, $3, $4)
                 RETURNING
                    user_id AS id,
                    full_name AS "fullName",
                    email,
                    contact_number AS "contactNumber",
                    created_at AS "createdAt"`;
    const { rows } = await db.query(sql, [
      fullName,
      email,
      password,
      contactNumber,
    ]);
    return rows[0];
  }
}

export const appAuthModel = new AppAuthModel();
