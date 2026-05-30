import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRoutes from "./routes/admin.route.js";
import storeRoutes from "./routes/store.route.js";
import appRoutes from "./routes/app.route.js";

import { errorHandler, notFound } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "5mb" }));

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
  res.send("Server is ready for RIBSHACK SYSTEM");
});

// Routes
app.use("/api/v1/admin", adminRoutes);

app.use("/api/v1/store", storeRoutes);

app.use("/api/v1/app", appRoutes);

// Error Middlewares
app.use(notFound);

app.use(errorHandler);

export default app;
