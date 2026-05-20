import express from "express";
import * as controller from "./analytics.controller.js";

const router = express.Router();

router.get("/kpis", controller.getKPIS);

export default router;
