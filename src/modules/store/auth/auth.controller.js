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

  logout: async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });
      return res
        .status(200)
        .json({ success: true, message: "Logout successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  me: async (req, res) => {
    try {
      const branch = await service.me(req.authUser.id);
      return res.status(200).json({ success: true, branch });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
