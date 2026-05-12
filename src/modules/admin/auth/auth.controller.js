import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import AdminAuthService from "./auth.service.js";

const AdminAuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const admin = await AdminAuthService.login(email, password);

      generateTokenAndSetCookies(res, admin.admin_id);

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
      return res.status(200).json({ success: true, admin: req.admin });
    } catch (error) {
      return res.status(401).json({ success: false, message: error.message });
    }
  },
};

export default AdminAuthController;
