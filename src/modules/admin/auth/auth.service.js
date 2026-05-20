import AppError from "../../../utils/AppError.js";
import { adminAuthModel as model } from "./auth.model.js";

export const login = async (email, password) => {
  const admin = await model.findByEmail(email);
  if (!admin) throw new AppError("Invalid credentials", 401);

  // Plain-text comparison for now — replace with bcrypt when ready
  const isMatch = admin.password_hash === password;
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  delete admin.password_hash;
  return admin;
};

export const me = async (adminId) => {
  const admin = await model.findById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);
  return admin;
};
