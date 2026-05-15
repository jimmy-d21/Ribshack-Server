import { storeMenuModel as model } from "./menu.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const getAllMenu = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId);
};

export const getMenuDetails = async (productId) => {
  const product = await model.findById(productId);
  if (!product) throw new Error("Product not found");
  return product;
};
