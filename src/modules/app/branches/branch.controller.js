import * as service from "./branch.service.js";

export const getAllAvailableBranches = async (req, res) => {
  try {
    const branches = await service.getAllAvailableBranches();
    return res.status(200).json({ success: true, branches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBranchDetails = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branchDetails = await service.getBranchDetails(branchId);
    return res.status(200).json({ success: true, branchDetails });
  } catch (error) {
    const status = error.message === "Branch not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const getAllBranchMenu = async (req, res) => {
  try {
    const { branchId } = req.params;
    const branchMenu = await service.getAllBranchMenu(branchId);
    return res.status(200).json({ success: true, branchMenu });
  } catch (error) {
    const status = error.message === "Branch not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};
