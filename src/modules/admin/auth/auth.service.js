import bcrypt from "bcryptjs";
import AdminAuthModel from "./auth.model.js";

const AdminAuthService = {
  login: async (email, password) => {
    const admin = await AdminAuthModel.findByEmail(email);
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
};

export default AdminAuthService;
