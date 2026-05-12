import jwt from "jsonwebtoken";
import ENV from "../../utils/env.js";
import AdminAuthModel from "../../modules/admin/auth/auth.model.js";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, ENV.jwt.secret);

    if (!decoded || !decoded.currentId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token Payload" });
    }

    const admin = await AdminAuthModel.findById(decoded.currentId);

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const { password_hash, ...adminData } = admin;
    req.admin = adminData;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token expired" });
    }

    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

export default verifyToken;
