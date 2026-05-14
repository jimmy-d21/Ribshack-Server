import { adminAuthModel as model } from "./auth.model.js";

export const AdminAuthService = {
  login: async (email, password) => {
    const admin = await model.findByEmail(email);
    if (!admin) {
      throw new Error("Invalid credentials");
    }

    // Todo: add bcrypt for this
    const isMatch = admin.password_hash === password;
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    delete admin.password;
    return admin;
  },

  me: async (adminId) => {
    const admin = await model.findById(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }

    return admin;
  },
};
