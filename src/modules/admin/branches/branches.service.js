import bcrypt from "bcryptjs";
import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { adminBranchesModel as model } from "./branches.model.js";

export const getAllBranches = async () => {
  return model.findAll();
};

export const getBranchDetails = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return branch;
};

export const createBranch = async (branchData) => {
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
    throw new AppError(
      `Region "${region}" not found. Valid regions are: Visayas, Luzon, Mindanao`,
      400,
    );
  }

  const takenUsername = await model.findByUsername(username);
  if (takenUsername) throw new AppError("Username is already taken", 409);

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return model.create({
    name: branch_name,
    location: full_address,
    city,
    region_id: existingRegion.region_id,
    manager: manager_name,
    phone: contact_number,
    username,
    password_hash: passwordHash,
  });
};

export const updateBranch = async (branchId, branchData) => {
  const {
    branch_name,
    full_address,
    city,
    manager_name,
    contact_number,
    username,
    password,
  } = branchData;

  const existingBranch = await model.findById(branchId);
  if (!existingBranch) throw new AppError("Branch not found", 404);

  if (username && username !== existingBranch.username) {
    const takenUsername = await model.findByUsername(username);
    if (takenUsername) throw new AppError("Username is already taken", 409);
  }

  let passwordHash = null;
  if (password && password.trim()) {
    const salt = await bcrypt.genSalt(10);
    passwordHash = await bcrypt.hash(password, salt);
  }

  return model.update(branchId, {
    name: branch_name || existingBranch.name,
    location: full_address || existingBranch.location,
    city: city || existingBranch.city,
    manager: manager_name || existingBranch.manager,
    phone: contact_number || existingBranch.phone,
    username: username || existingBranch.username,
    password_hash: passwordHash,
  });
};

export const deleteBranch = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return model.deleteById(branchId);
};

export const updateBranchStatus = async (branchId, statusParam) => {
  const validStatuses = ["open", "closed"];
  if (!validStatuses.includes(statusParam.toLowerCase())) {
    throw new AppError("Status must be either 'open' or 'closed'", 400);
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const branch = await model.findById(branchId);
    if (!branch) throw new AppError("Branch not found", 404);

    const isOpen = statusParam.toLowerCase() === "open";
    const updatedBranch = await model.updateStatus(client, branchId, isOpen);

    const logStatus = isOpen ? "OPEN" : "CLOSED";
    await model.createStatusLogs(client, branchId, logStatus);

    await client.query("COMMIT");
    return updatedBranch;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
