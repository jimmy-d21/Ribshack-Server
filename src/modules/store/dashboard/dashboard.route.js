import express from "express";
import * as controller from "./dashboard.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIS);
router.get("/revenue/trend", controller.getWeeklyRevenue);
router.get("/revenue/hourly", controller.getHourlyRevenue);

export default router;
