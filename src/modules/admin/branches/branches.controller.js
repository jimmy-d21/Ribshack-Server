import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./branches.service.js";

export const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await service.getAllBranches();
  return res.status(200).json({ success: true, branches });
});

export const getBranchDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const branch = await service.getBranchDetails(branchId);
  return res.status(200).json({ success: true, branch });
});

export const createBranch = asyncHandler(async (req, res) => {
  const branch = await service.createBranch(req.body);
  return res
    .status(201)
    .json({ success: true, message: "Branch created successfully", branch });
});

export const updateBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const branch = await service.updateBranch(branchId, req.body);
  return res
    .status(200)
    .json({ success: true, message: "Branch updated successfully", branch });
});

export const deleteBranch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  await service.deleteBranch(branchId);
  return res
    .status(200)
    .json({ success: true, message: "Branch deleted successfully" });
});

export const updateBranchStatus = asyncHandler(async (req, res) => {
  const { branchId, status } = req.params;
  const data = await service.updateBranchStatus(branchId, status);
  return res.status(200).json({
    success: true,
    message: `Branch is now ${status.toUpperCase()}`,
    data,
  });
});
