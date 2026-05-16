import express from "express";
import * as validate from "./address.validation.js";
import * as controller from "./address.controller.js";

const router = express.Router();

router.post("/", validate.addAddress, controller.addAddress);

export default router;
