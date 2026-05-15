import { appHomeModel as model } from "./home.model.js";

export const getBestSellingMenu = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new Error("Branch not found");

  return await model.findBestSellingMenu(branchId);
};

export const getAllCategories = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new Error("Branch not found");

  return await model.findAllCategories(branchId);
};
