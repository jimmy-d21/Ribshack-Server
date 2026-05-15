import { appBranchModel as model } from "./branch.model.js";

// Todo: add location of the user to get all the branches
export const getAllAvailableBranches = async (userId) => {
  // temporary location from user usin userId
  const location = "Cebu City"; // Default cebu
  return await model.findAll(location);
};

export const getAllBranchMenu = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new Error("Branch not found");
  return await model.findAllBranchMenu(branchId);
};

export const getBranchDetails = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) {
    throw new Error("Branch not found");
  }
  return branch;
};
