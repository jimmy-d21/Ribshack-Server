import { appBranchModel as model } from "./branch.model.js";

// Todo: add location of the user to get all the branches
export const getAllAvailableBranches = async (userId) => {
  // temporary location from user usin userId
  const location = "Cebu City"; // Default cebu
  return await model.findAll(location);
};
