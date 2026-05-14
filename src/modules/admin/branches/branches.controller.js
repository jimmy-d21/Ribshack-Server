import { AdminBranchesService as service } from "./branches.service.js";

export const AdminBranchesController = {
  getAllBranches: async (req, res) => {
    try {
      const branches = await service.getAllBranches();
      return res.status(200).json({ success: true, branches });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getBranchDetails: async (req, res) => {
    try {
      const { branchId } = req.params;
      const branch = await service.getBranchDetails(branchId);
      return res.status(200).json({ success: true, branch });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  createBranch: async (req, res) => {
    try {
      const {
        branch_name,
        full_address,
        city,
        region,
        manager_name,
        contact_number,
        username,
        password,
      } = req.body;

      const newBranch = await service.createBranch({
        branch_name: branch_name.trim(),
        full_address: full_address.trim(),
        city: city.trim(),
        region: region.trim(),
        manager_name: manager_name.trim(),
        contact_number: contact_number.trim(),
        username: username.trim(),
        password,
      });

      return res.status(201).json({
        success: true,
        message: "Branch created successfully",
        branch: newBranch,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateBranch: async (req, res) => {
    try {
      const { branchId } = req.params;
      const {
        branch_name,
        full_address,
        city,
        is_open,
        manager_name,
        contact_number,
        username,
        password,
      } = req.body;

      const updatedBranch = await service.updateBranch(branchId, {
        branch_name,
        full_address,
        city,
        is_open,
        manager_name,
        contact_number,
        username,
        password,
      });

      return res.status(200).json({
        success: true,
        message: "Branch updated successfully",
        branch: updatedBranch,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteBranch: async (req, res) => {
    try {
      const { branchId } = req.params;
      await service.deleteBranch(branchId);
      return res.status(200).json({
        success: true,
        message: "Branch deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateBranchStatus: async (req, res) => {
    try {
      const { branchId, status } = req.params;

      const updatedBranch = await service.updateBranchStatus(branchId, status);

      return res.status(200).json({
        success: true,
        message: `Branch is now ${status.toUpperCase()}`,
        data: updatedBranch,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
