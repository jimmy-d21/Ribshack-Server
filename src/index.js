import express from "express";
import cookieParser from "cookie-parser";
import ENV from "./utils/env.js";
import { checkConnection } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();
const PORT = ENV.server.port || 5000;

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`Server is ready for RIBSHACK SYSTEM`);
});

app.use("/api/v1/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await checkConnection();
  app.listen(PORT, () => {
    console.log(`Server is ready on PORT: ${PORT}`);
  });
};

startServer();
