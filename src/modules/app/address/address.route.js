import express from "express";
import * as controller from "./address.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { addAddressSchema } from "./address.schema.js";

const router = express.Router();

router.get("/", controller.getAllAddress);
router.get("/:addressId", controller.getAddressDetails);
router.post("/", validate(addAddressSchema), controller.addAddress);
router.put("/:addressId", validate(addAddressSchema), controller.updateAddress);
router.delete("/:addressId", controller.deleteAddress);
router.patch("/:addressId/default", controller.setDefaultAddress);

export default router;
