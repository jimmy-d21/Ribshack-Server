// branches.controller.js
import AdminBranchesService from "./branches.service.js";

const AdminBranchesController = {
  getAllBranches: async (req, res) => {
    try {
      const branches = await AdminBranchesService.getAllBranches();
      return res.status(200).json({ success: true, branches });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  addBranch: async (req, res) => {
    try {
      const {
        branch_name,
        full_address,
        city,
        region, // e.g. "Visayas", "Luzon", "Mindanao"
        manager_name,
        contact_number,
        username,
        password,
      } = req.body;

      // Check for missing fields
      if (
        !branch_name ||
        !full_address ||
        !city ||
        !region ||
        !manager_name ||
        !contact_number ||
        !username ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message: "Please provide all required fields including credentials",
        });
      }

      // Check for empty strings
      if (
        !branch_name.trim() ||
        !full_address.trim() ||
        !city.trim() ||
        !region.trim() ||
        !manager_name.trim() ||
        !contact_number.trim() ||
        !username.trim() ||
        !password.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Fields cannot be empty or whitespace",
        });
      }

      const newBranch = await AdminBranchesService.create({
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

      const updatedBranch = await AdminBranchesService.update(branchId, {
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

      if (!branchId) {
        return res
          .status(400)
          .json({ success: false, message: "Branch ID is required" });
      }

      await AdminBranchesService.delete(branchId);

      return res.status(200).json({
        success: true,
        message: "Branch deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default AdminBranchesController;
