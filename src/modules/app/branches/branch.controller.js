import * as service from "./branch.service.js";

export const getAllAvailableBranches = async (req, res) => {
  try {
    const userId = req.authUser.id; // to get user location soon
    const branches = await service.getAllAvailableBranches(userId);

    return res.status(200).json({ success: true, branches });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const getAllBranchMenu = async (req, res) => {
  try {
    const { branchId } = req.params;

    const branchMenu = await service.getAllBranchMenu(branchId);
    return res.status(200).json({ success: true, branchMenu });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const getBranchDetails = async (req, res) => {
  try {
    const { branchId } = req.params;

    const branchDetails = await service.getBranchDetails(branchId);
    return res.status(200).json({ success: true, branchDetails });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};
