// branches.service.js
import bcrypt from "bcryptjs";
import AdminBranchesModel from "./branches.model.js";

const AdminBranchesService = {
  getAllBranches: async () => {
    const branches = await AdminBranchesModel.findAll();
    return branches;
  },
};

export default AdminBranchesService;
