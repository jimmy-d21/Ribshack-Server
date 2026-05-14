import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import { StoreAuthService as service } from "./auth.service.js";

export const StoreAuthController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const branch = await service.login(username, password);

      const role = "branch";
      generateTokenAndSetCookies(res, branch.branch_id, role);

      return res
        .status(200)
        .json({ success: true, message: "Welcome back!", branch });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
};
