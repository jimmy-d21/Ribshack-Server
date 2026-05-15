import { appBranchModel as model } from "./branch.model.js";

export const getAllAvailableBranches = async () => {
  const location = "Cebu City"; // Logic for user location can be added here later
  return await model.findAll(location);
};

export const getBranchDetails = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const getAllBranchMenu = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  return await model.findAllBranchMenu(branchId);
};
