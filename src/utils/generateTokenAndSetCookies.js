import jwt from "jsonwebtoken";
import ENV from "./env.js";

const generateTokenAndSetCookies = (res, currentId, role) => {
  if (!currentId) {
    console.error("Error: currentId is missing for token generation");
    return;
  }

  const token = jwt.sign({ id: currentId, role }, ENV.jwt.secret, {
    expiresIn: "7d",
  });

  let cookieName;
  switch (role) {
    case "admin":
      cookieName = "admin_token";
      break;
    case "branch":
      cookieName = "branch_token";
      break;
    case "customer":
      cookieName = "customer_token";
      break;
    default:
      cookieName = "app_token";
      break;
  }

  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: ENV.server.node_env === "production",
    sameSite: ENV.server.node_env === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

export default generateTokenAndSetCookies;
