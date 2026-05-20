import bcrypt from "bcryptjs";
import AppError from "../../../utils/AppError.js";
import { storeAuthModel as model } from "./auth.model.js";

export const login = async (username, password) => {
  const branch = await model.findByUsername(username);
  if (!branch) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, branch.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  delete branch.password;
  return branch;
};

export const me = async (branchId) => {
  const branch = await model.findById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);

  delete branch.password;
  return branch;
};
