import pg from "pg";
import ENV from "../utils/env.js";

const { Pool } = pg;

const db = new Pool({
  host: ENV.database.host,
  port: ENV.database.port,
  user: ENV.database.user,
  password: ENV.database.password,
  database: ENV.database.database_name,
});

const checkConnection = async () => {
  try {
    const client = await db.connect();
    console.log(`Database connected successfully`);
    client.release();
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export { db as default, checkConnection };
