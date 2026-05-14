import bcrypt from "bcryptjs";
import { storeAuthModel as model } from "./auth.model.js";

export const StoreAuthService = {
  login: async (username, password) => {
    const branch = await model.findByUsername(username);
    if (!branch) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, branch.password_hash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    delete branch.password_hash;
    return branch;
  },
};
