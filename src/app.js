import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/admin.route.js";
import storeRoutes from "./routes/store.route.js";
import appRoutes from "./routes/app.route.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import ENV from "./utils/ENV.js";

const app = express();

app.use(
  cors({
    origin: ENV.url.length
      ? ENV.url
      : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Server is ready for RIBSHACK SYSTEM");
});

// ROUTES
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/app", appRoutes);

// ERROR MIDDLEWARES
app.use(notFound);
app.use(errorHandler);

export default app;
