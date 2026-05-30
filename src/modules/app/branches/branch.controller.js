import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./branch.service.js";

export const getAllAvailableBranches = asyncHandler(async (req, res) => {
  const branches = await service.getAllAvailableBranches();
  return res.status(200).json({ success: true, branches });
});

export const getBranchDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const branchDetails = await service.getBranchDetails(branchId);
  return res.status(200).json({ success: true, branchDetails });
});

export const getAllBranchMenu = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const { category } = req.query;

  const branchMenu = await service.getAllBranchMenu(branchId, category);

  return res.status(200).json({ success: true, branchMenu });
});
