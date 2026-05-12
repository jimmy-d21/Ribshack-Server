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
};

export default AdminBranchesController;
