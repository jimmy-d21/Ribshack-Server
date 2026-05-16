import express from "express";
import * as validate from "./address.validation.js";
import * as controller from "./address.controller.js";

const router = express.Router();

router.get("/", validate.getAllAddress, controller.getAllAddress);
router.get(
  "/:addressId",
  validate.getAddressDetails,
  controller.getAddressDetails,
);
router.post("/", validate.addAddress, controller.addAddress);
router.put("/:addressId", validate.updateAddress, controller.updateAddress);
router.delete("/:addressId", validate.deleteAddress, controller.deleteAddress);

export default router;
