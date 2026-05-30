import AppError from "../../../utils/AppError.js";
import { appBranchModel as model } from "./branch.model.js";

export const getAllAvailableBranches = async () => {
  const location = "Bacolod City"; // Logic for user location can be added here later
  return model.findAll(location);
};

export const getBranchDetails = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return branch;
};

export const getAllBranchMenu = async (branchId, category = null) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);

  return model.findAllBranchMenu(branchId, category);
};
