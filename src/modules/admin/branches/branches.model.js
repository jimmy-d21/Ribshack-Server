import db from "../../../config/db.js";

class AdminBranchesModel {
  async findAll() {
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
        b.created_at,
        JSON_BUILD_OBJECT(
          'total_revenue', COALESCE((
            SELECT SUM(o.total_amount)
            FROM orders o
            WHERE o.placed_at::date = CURRENT_DATE
              AND o.branch_id = b.branch_id
              AND o.order_status != 'CANCELLED'
          ), 0.00),
          'orders_today', (
            SELECT COUNT(*)
            FROM orders o
            WHERE o.placed_at::date = CURRENT_DATE
              AND o.branch_id = b.branch_id
          )
        ) AS branch_details
      FROM branches b
      JOIN branches_regions br ON b.region_id = br.region_id
      ORDER BY b.created_at DESC
    `;
    const { rows } = await db.query(sql);
    return rows;
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
        b.password_hash AS password,
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

  async findRegionByName(regionName) {
    const { rows } = await db.query(
      "SELECT * FROM branches_regions WHERE LOWER(region_name) = LOWER($1)",
      [regionName],
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING branch_id, branch_name, full_address, city, region_id,
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

    const columns = [
      "branch_name = $1",
      "full_address = $2",
      "city = $3",
      "is_open = $4",
      "manager_name = $5",
      "contact_number = $6",
      "username = $7",
      "updated_at = CURRENT_TIMESTAMP",
    ];

    const values = [name, location, city, status, manager, phone, username];

    if (password_hash) {
      columns.push(`password_hash = $${values.length + 1}`);
      values.push(password_hash);
    }

    values.push(branchId);

    const sql = `
    UPDATE branches
    SET ${columns.join(", ")}
    WHERE branch_id = $${values.length}
    RETURNING
      branch_id,
      branch_name,
      full_address,
      city,
      is_open,
      manager_name,
      contact_number,
      username,
      updated_at
  `;

    const { rows } = await db.query(sql, values);

    return rows[0];
  }

  async deleteById(id) {
    const result = await db.query("DELETE FROM branches WHERE branch_id = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }

  async updateStatus(client, branchId, isOpen) {
    const sql = `
      UPDATE branches
      SET is_open = $1, updated_at = CURRENT_TIMESTAMP
      WHERE branch_id = $2
      RETURNING branch_id, branch_name, is_open, manager_name, updated_at
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

  async branchAnalytics(branchId) {
    const sql = `
        SELECT
          b.branch_name AS branchName,

          -- TODAY ORDER STATUS METRICS
          (
            SELECT JSON_BUILD_OBJECT(
              'revenue', COALESCE(SUM(total_amount), 0),
              'orders', COUNT(order_id),
              'avgOrderValue', COALESCE(ROUND(AVG(total_amount), 2), 0),
              'customer', COUNT(DISTINCT customer_id)
            )
            FROM orders
            WHERE branch_id = b.branch_id
              AND order_status != 'CANCELLED'
              AND placed_at::date = CURRENT_DATE
          ) AS "todayStats",

          -- TODAY'S ORDER STATUS METRICS
          (
              SELECT JSON_BUILD_OBJECT(
                'completed', COUNT(CASE WHEN order_status = 'DELIVERED' THEN 1 END),
                'preparing', COUNT(CASE WHEN order_status = 'PREPARING' THEN 1 END),
                'pending',   COUNT(CASE WHEN order_status = 'PLACED' THEN 1 END),
                'cancelled', COUNT(CASE WHEN order_status = 'CANCELLED' THEN 1 END)
              )
              FROM orders
              WHERE branch_id = b.branch_id
                AND placed_at::date = CURRENT_DATE
            ) AS "orderStatus",

          -- LAST 7 DAYS WEEKLY REVENUE TRENDS
          (
            SELECT COALESCE(JSON_AGG(weekly_series), '[]'::json)
            FROM (
              SELECT 
                TO_CHAR(day::date, 'Dy') AS "day",
                COALESCE(SUM(o.total_amount), 0) AS "revenue"
              FROM GENERATE_SERIES(
                CURRENT_DATE - INTERVAL '6 days',
                CURRENT_DATE,
                INTERVAL '1 day'
              ) AS day
              LEFT JOIN orders o ON o.placed_at::date = day::date 
                                AND o.branch_id = b.branch_id 
                                AND o.order_status != 'CANCELLED'
              GROUP BY day::date
              ORDER BY day::date ASC
            ) weekly_series
          ) AS "weeklyRevenue",

          -- TODAY'S HOURLY PEAK BREAKDOWN
          (
              SELECT COALESCE(JSON_AGG(hourly_series), '[]'::json)
              FROM (
                SELECT 
                  TO_CHAR(h, 'FMPM') AS "hour",
                  COUNT(o.order_id) AS "orders"
                FROM GENERATE_SERIES(
                  (CURRENT_DATE + INTERVAL '10 hours'), -- Starts at 10:00 AM
                  (CURRENT_DATE + INTERVAL '21 hours'), -- Ends at 9:00 PM
                  INTERVAL '1 hour'
                ) AS h
                LEFT JOIN orders o ON DATE_TRUNC('hour', o.placed_at) = h 
                                  AND o.branch_id = b.branch_id
                GROUP BY h
                ORDER BY h ASC
              ) hourly_series
            ) AS "hourlyOrders",

          -- TOP PERFORMING PRODUCTS FOR THE DAY
          (
              SELECT COALESCE(JSON_AGG(top_series), '[]'::json)
              FROM (
                SELECT 
                  p.product_name AS "name",
                  SUM(oi.quantity)::int AS "sold",
                  SUM(oi.quantity * oi.unit_price) AS "revenue"
                FROM order_items oi
                JOIN orders o ON o.order_id = oi.order_id
                JOIN products p ON oi.product_id = p.product_id
                WHERE o.branch_id = b.branch_id
                  AND o.order_status != 'CANCELLED'
                  AND o.placed_at::date = CURRENT_DATE
                GROUP BY p.product_id, p.product_name
                ORDER BY revenue DESC
                LIMIT 5
              ) top_series
            ) AS "topProducts",

          -- RECENT ACTIVE INCOMING ORDERS
          (
              SELECT COALESCE(JSON_AGG(recent_series), '[]'::json)
              FROM (
                SELECT 
                  '#ORD-' || o.order_id AS "id",
                  TO_CHAR(o.placed_at, 'FMHH:MI AM') AS "time",
                  (SELECT COALESCE(SUM(quantity), 0)::int FROM order_items WHERE order_id = o.order_id) AS "items",
                  o.total_amount AS "total",
                  LOWER(o.order_status) AS "status"
                FROM orders o
                WHERE o.branch_id = b.branch_id
                ORDER BY o.placed_at DESC
                LIMIT 5
              ) recent_series
            ) AS "recentOrders"
          
        FROM branches b
        WHERE b.branch_id = $1`;

    const { rows } = await db.query(sql, [branchId]);
    return rows[0];
  }

  async findAllProducts() {
    const sql = `SELECT * FROM products`;
    const { rows } = await db.query(sql);
    return rows;
  }

  async createWithMenu(branchData) {
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

    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const branchSql = `
      INSERT INTO branches
        (branch_name, full_address, city, region_id, manager_name, contact_number, username, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING branch_id, branch_name, full_address, city, region_id, manager_name, contact_number, username, is_open, created_at
    `;

      const branchResult = await client.query(branchSql, [
        name,
        location,
        city,
        region_id,
        manager,
        phone,
        username,
        password_hash,
      ]);

      const newBranch = branchResult.rows[0];
      const newBranchId = newBranch.branch_id;

      const productsResult = await client.query(
        "SELECT product_id FROM products WHERE is_active = TRUE",
      );
      const products = productsResult.rows;

      for (const product of products) {
        await client.query(
          `INSERT INTO branch_product_availability (branch_id, product_id, is_available)
         VALUES ($1, $2, TRUE)
         ON CONFLICT (branch_id, product_id) DO NOTHING`,
          [newBranchId, product.product_id],
        );

        await client.query(
          `INSERT INTO branch_menu (branch_id, product_id, price_override, is_visible)
         VALUES ($1, $2, NULL, TRUE)
         ON CONFLICT (branch_id, product_id) DO NOTHING`,
          [newBranchId, product.product_id],
        );
      }

      await client.query("COMMIT");
      return newBranch;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export const adminBranchesModel = new AdminBranchesModel();
