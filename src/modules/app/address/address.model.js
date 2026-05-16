import db from "../../../config/db.js";

class AppAddressModel {
  async createAddress(userId, addressData) {
    const { label, fullAddress, city, province, postalCode } = addressData;

    const sql = `
      INSERT INTO customer_addresses
        (customer_id, address_label, full_address, city, province, postal_code)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING
        address_id AS "id",
        address_label AS "label",
        full_address AS "address",
        city,
        province,
        postal_code AS "postalCode",
        is_default AS "isDefault",
        created_at AS "createdAt"`;

    const values = [userId, label, fullAddress, city, province, postalCode];
    const { rows } = await db.query(sql, values);
    return rows[0];
  }
}

export const appAddressModel = new AppAddressModel();
