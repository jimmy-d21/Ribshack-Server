import { storeInventoryModel as model } from "./inventory.model.js";

export const getAllInventory = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) {
    throw new Error("Branch not found");
  }

  const inventory = await model.findAll(branchId);
  return inventory;
};
