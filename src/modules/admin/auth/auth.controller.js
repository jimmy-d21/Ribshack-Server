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

      res.status(200).json({ message: "Login successfully", admin });
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  },
};

export default AdminAuthController;
