import db from "../../../config/db.js";

class AppAddressModel {
  async findAddressesByUserId(userId) {
    const sql = `
      SELECT
        address_id    AS "id",
        address_label AS "label",
        full_address  AS "fullAddress",
        city,
        province,
        postal_code   AS "postalCode",
        land_mark     AS "landMark",
        is_default    AS "isDefault",
        created_at    AS "createdAt"
      FROM   customer_addresses
      WHERE  customer_id = $1
      ORDER BY is_default DESC, created_at DESC
    `;
    const { rows } = await db.query(sql, [userId]);
    return rows;
  }

  async findAddressById(addressId) {
    const sql = `
      SELECT
        address_id    AS "id",
        address_label AS "label",
        full_address  AS "fullAddress",
        city,
        province,
        postal_code   AS "postalCode",
        land_mark     AS "landMark",
        is_default    AS "isDefault",
        created_at    AS "createdAt"
      FROM   customer_addresses
      WHERE  address_id = $1
      ORDER BY is_default DESC, created_at DESC
    `;
    const { rows } = await db.query(sql, [addressId]);
    return rows[0];
  }

  async createAddress(userId, addressData) {
    const {
      label,
      fullAddress,
      city,
      province,
      postalCode,
      landMark,
      isDefault,
    } = addressData;

    const sql = `
      INSERT INTO customer_addresses
        (customer_id, address_label, full_address, city, province, postal_code, land_mark, is_default)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        address_id    AS "id",
        address_label AS "label",
        full_address  AS "fullAddress",
        city,
        province,
        postal_code   AS "postalCode",
        land_mark     AS "landMark",
        is_default    AS "isDefault",
        created_at    AS "createdAt"
    `;

    const values = [
      userId,
      label,
      fullAddress,
      city,
      province,
      postalCode,
      landMark,
      isDefault,
    ];

    const { rows } = await db.query(sql, values);
    return rows[0];
  }

  async updateAddress(addressId, addressData) {
    const {
      label,
      fullAddress,
      landMark,
      city,
      province,
      postalCode,
      isDefault,
    } = addressData;

    const sql = `UPDATE customer_addresses
                 SET address_label = $1, 
                     full_address = $2, 
                     land_mark = $3, 
                     city = $4, 
                     province = $5, 
                     postal_code = $6, 
                     is_default = $7, 
                     updated_at = CURRENT_TIMESTAMP
                 WHERE address_id = $8
                 RETURNING
                    address_id    AS "id",
                    address_label AS "label",
                    full_address  AS "fullAddress",
                    city,
                    province,
                    postal_code   AS "postalCode",
                    land_mark     AS "landMark",
                    is_default    AS "isDefault",
                    created_at    AS "createdAt",
                    updated_at    AS "updatedAt" `;
    const values = [
      label,
      fullAddress,
      landMark,
      city,
      province,
      postalCode,
      isDefault,
      addressId,
    ];

    const { rows } = await db.query(sql, values);
    return rows[0];
  }

  async updateAllAddressDefault(userId, addressId) {
    const sql = `UPDATE customer_addresses
                 SET is_default = FALSE
                 WHERE customer_id = $1 AND address_id != $2`;
    await db.query(sql, [userId, addressId]);
  }
}

export const appAddressModel = new AppAddressModel();
