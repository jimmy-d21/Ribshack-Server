// branches.service.js
import bcrypt from "bcryptjs";
import AdminBranchesModel from "./branches.model.js";
import db from "../../../config/db.js";

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

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
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

  update: async (branchId, branchData) => {
    const {
      branch_name,
      full_address,
      city,
      is_open,
      manager_name,
      contact_number,
      username,
      password,
    } = branchData;

    // Check if branch exists
    const existingBranch = await AdminBranchesModel.findById(branchId);
    if (!existingBranch) throw new Error("Branch not found");

    // If username is being changed, check it's not taken by another branch
    if (username && username !== existingBranch.username) {
      const takenUsername = await AdminBranchesModel.findByUsername(username);
      if (takenUsername) throw new Error("Username is already taken");
    }

    // Hash password only if a new one is provided
    let password_hash = null;
    if (password && password.trim()) {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const updatedBranch = await AdminBranchesModel.update(branchId, {
      branch_name: branch_name || existingBranch.branch_name,
      full_address: full_address || existingBranch.full_address,
      city: city || existingBranch.city,
      is_open: is_open ?? existingBranch.is_open,
      manager_name: manager_name || existingBranch.manager_name,
      contact_number: contact_number || existingBranch.contact_number,
      username: username || existingBranch.username,
      password_hash: password_hash,
    });

    return updatedBranch;
  },

  delete: async (branchId) => {
    // Check if it exists
    const branch = await AdminBranchesModel.findById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }

    // Perform the deletion
    return await AdminBranchesModel.deleteById(branchId);
  },

  updateStatus: async (branchId, statusParam) => {
    // Get a dedicated client from the pool for the transaction
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const branch = await AdminBranchesModel.findById(branchId);
      if (!branch) {
        throw new Error("Branch not found");
      }

      // Convert string 'Open'/'Closed' to Boolean for the 'branches' table
      const isOpenBool = statusParam.toLowerCase() === "open";

      // Update the branch status
      const updatedStatusBranch = await AdminBranchesModel.updateStatus(
        client,
        branchId,
        isOpenBool,
      );

      // Convert Boolean to Uppercase String 'OPEN'/'CLOSED' for the logs
      const logStatus = isOpenBool ? "OPEN" : "CLOSED";

      await AdminBranchesModel.createStatusLogs(client, branchId, logStatus);

      await client.query("COMMIT");
      return updatedStatusBranch;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default AdminBranchesService;
