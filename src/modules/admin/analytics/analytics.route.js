import express from "express";
import * as controller from "./analytics.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIS);
router.get("/revenue/regional", controller.getRegionalRevenue);
router.get("/branches/leaderboard", controller.getTopBranches);
router.get("/sales/by-category", controller.getSalesByCategory);
router.get("/revenue/weekly", controller.getWeeklyRevenue);
router.get("/revenue/monthly", controller.getMonthlyRevenue);
router.get("/products/bestsellers", controller.getProductBestSeller);

export default router;
