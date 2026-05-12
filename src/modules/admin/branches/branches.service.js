// branches.service.js
import bcrypt from "bcryptjs";
import AdminBranchesModel from "./branches.model.js";

const AdminBranchesService = {
  getAllBranches: async () => {
    const branches = await AdminBranchesModel.findAll();
    return branches;
  },

  create: async (branchData) => {
    const {
      branch_name,
      full_address,
      city,
      region,
      manager_name,
      contact_number,
      username,
      password,
    } = branchData;

    // Look up region by name — must already exist in branches_regions
    const existingRegion = await AdminBranchesModel.findRegionByName(region);
    if (!existingRegion) {
      throw new Error(
        `Region "${region}" not found. Valid regions are: Visayas, Luzon, Mindanao`,
      );
    }

    // Check if username is already taken
    const existingBranch = await AdminBranchesModel.findByUsername(username);
    if (existingBranch) {
      throw new Error("Username is already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newBranch = await AdminBranchesModel.create({
      branch_name,
      full_address,
      city,
      region_id: existingRegion.region_id,
      manager_name,
      contact_number,
      username,
      password_hash,
    });

    return newBranch;
  },
};

export default AdminBranchesService;
