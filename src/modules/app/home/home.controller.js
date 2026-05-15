import * as service from "./home.service.js";

export const getBestSellingMenu = async (req, res) => {
  try {
    const { branchId } = req.params;
    const bestSellingMenu = await service.getBestSellingMenu(branchId);

    return res.status(200).json({ success: true, bestSellingMenu });
  } catch (error) {
    const status = error.message === "Branch not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const { branchId } = req.params;
    const category = await service.getAllCategories(branchId);
    return res.status(200).json({ success: true, category });
  } catch (error) {
    const status = error.message === "Branch not found" ? 404 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};
