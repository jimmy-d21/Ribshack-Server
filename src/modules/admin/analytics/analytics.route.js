import express from "express";
import * as controller from "./analytics.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIS);
router.get("/revenue/regional", controller.getRegionalRevenue);
router.get("/branches/leaderboard", controller.getTopBranches);

export default router;
