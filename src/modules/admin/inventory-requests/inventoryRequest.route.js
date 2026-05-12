import express from "express";
import AdminInventoryRequestController from "./inventoryRequest.controller.js";

const router = express.Router();

router.get("/", AdminInventoryRequestController.getAllInventoryRequests);

export default router;
