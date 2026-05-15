import { storeInventoryModel as model } from "./inventory.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const getAllInventory = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId);
};

export const getAllInventoryCritical = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId, { criticalOnly: true });
};
