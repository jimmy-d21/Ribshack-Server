import jwt from "jsonwebtoken";
import ENV from "../utils/env.js";

const verifyToken = async (req, res, next) => {
  try {
    const cookiesToken = req.cookies?.token;
    const bearToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = cookiesToken || bearToken;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, ENV.jwt.secret);
    req.authUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.authUser.role)) {
      return res.status(403).json({
        message: `Forbidden - Required role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

export { verifyToken as default, authorizeRoles };
