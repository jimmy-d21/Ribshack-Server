import jwt from "jsonwebtoken";
import ENV from "../utils/env.js";

const roleCookieMap = {
  admin: "admin_token",
  branch: "branch_token",
  customer: "customer_token",
};

const verifyToken = async (req, res, next) => {
  try {
    const decodedTokens = [];

    for (const [role, cookieName] of Object.entries(roleCookieMap)) {
      const cookieToken = req.cookies?.[cookieName];
      if (cookieToken) {
        try {
          const decoded = jwt.verify(cookieToken, ENV.jwt.secret);
          decodedTokens.push(decoded);
        } catch {
          continue;
        }
      }
    }

    const bearToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (bearToken) {
      try {
        const decoded = jwt.verify(bearToken, ENV.jwt.secret);
        decodedTokens.push(decoded);
      } catch {}
    }

    if (decodedTokens.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    req.decodedTokens = decodedTokens;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const matchedToken = req.decodedTokens?.find((decoded) =>
      allowedRoles.includes(decoded.role),
    );

    if (!matchedToken) {
      return res.status(403).json({
        success: false,
        message: `Forbidden - Required role: ${allowedRoles.join(" or ")}`,
      });
    }

    req.authUser = matchedToken;
    next();
  };
};

export { verifyToken as default, authorizeRoles };
