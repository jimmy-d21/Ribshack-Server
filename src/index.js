import express from "express";
import ENV from "./utils/env.js";
import { checkConnection } from "./config/db.js";

const app = express();
const PORT = ENV.server.port || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  await checkConnection();
  app.listen(PORT, () => {
    console.log(`Server is ready on PORT: ${PORT}`);
  });
};

startServer();
