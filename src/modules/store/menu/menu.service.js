import { storeMenuModel as model } from "./menu.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const getAllMenu = async (branchId) => {
  // fixed typo branhcId → branchId
  await validateBranch(branchId);
  return model.findAll(branchId); // removed redundant await
};
