import express from "express";
import * as controller from "./analytics.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIS);
router.get("/revenue/regional", controller.getRegionalRevenue);

export default router;
