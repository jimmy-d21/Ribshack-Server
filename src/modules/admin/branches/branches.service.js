import bcrypt from "bcryptjs";
import db from "../../../config/db.js";
import { adminBranchesModel as model } from "./branches.model.js";

export const AdminBranchesService = {
  getAllBranches: async () => {
    const branches = await model.findAll();
    return branches;
  },

  getBranchDetails: async (branchId) => {
    const branch = await model.findById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return branch;
  },

  createBranch: async (branchData) => {
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

    const existingRegion = await model.findRegionByName(region);
    if (!existingRegion) {
      throw new Error(
        `Region "${region}" not found. Valid regions are: Visayas, Luzon, Mindanao`,
      );
    }

    const existingBranch = await model.findByUsername(username);
    if (existingBranch) {
      throw new Error("Username is already taken");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newBranch = await model.create({
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

  updateBranch: async (branchId, branchData) => {
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

    const existingBranch = await model.findById(branchId);
    if (!existingBranch) {
      throw new Error("Branch not found");
    }

    if (username && username !== existingBranch.username) {
      const takenUsername = await model.findByUsername(username);
      if (takenUsername) {
        throw new Error("Username is already taken");
      }
    }

    let password_hash = null;
    if (password && password.trim()) {
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const updatedBranch = await model.update(branchId, {
      branch_name: branch_name || existingBranch.branch_name,
      full_address: full_address || existingBranch.full_address,
      city: city || existingBranch.city,
      is_open: is_open ?? existingBranch.is_open,
      manager_name: manager_name || existingBranch.manager_name,
      contact_number: contact_number || existingBranch.contact_number,
      username: username || existingBranch.username,
      password_hash,
    });

    return updatedBranch;
  },

  deleteBranch: async (branchId) => {
    const branch = await model.findById(branchId);
    if (!branch) {
      throw new Error("Branch not found");
    }
    return await model.deleteById(branchId);
  },

  updateBranchStatus: async (branchId, statusParam) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const branch = await model.findById(branchId);
      if (!branch) {
        throw new Error("Branch not found");
      }

      const isOpenBool = statusParam.toLowerCase() === "open";

      const updatedBranch = await model.updateStatus(
        client,
        branchId,
        isOpenBool,
      );

      const logStatus = isOpenBool ? "OPEN" : "CLOSED";
      await model.createStatusLogs(client, branchId, logStatus);

      await client.query("COMMIT");
      return updatedBranch;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
