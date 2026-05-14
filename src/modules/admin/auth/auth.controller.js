import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import { AdminAuthService as service } from "./auth.service.js";

export const AdminAuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await service.login(email, password);

      const role = "admin";
      generateTokenAndSetCookies(res, admin.admin_id, role);

      return res.status(200).json({
        success: true,
        message: "Login successfully",
        admin,
      });
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
      const admin = await service.me(req.authUser.id);
      return res.status(200).json({ success: true, admin });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
};
