import "dotenv/config";

const ENV = Object.freeze({
  server: {
    port: process.env.PORT,
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database_name: process.env.DB_NAME,
  },
});

export default ENV;
