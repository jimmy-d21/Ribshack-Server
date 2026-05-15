import * as service from "./inventory.service.js";

export const getAllInventory = async (req, res) => {
  try {
    const branchId = req.authUser.id;

    const inventory = await service.getAllInventory(branchId);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const getAllInventoryCritical = async (req, res) => {
  try {
    const branchId = req.authUser.id;

    const inventory = await service.getAllInventoryCritical(branchId);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
