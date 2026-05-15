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
