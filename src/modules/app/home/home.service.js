import AppError from "../../../utils/AppError.js";
import { appHomeModel as model } from "./home.model.js";

export const getBestSellingMenu = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return model.findBestSellingMenu(branchId);
};

export const getAllCategories = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return model.findAllCategories(branchId);
};
