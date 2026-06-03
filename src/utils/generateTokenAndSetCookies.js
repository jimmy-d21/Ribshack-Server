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

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.server.node_env === "production",
    sameSite: ENV.server.node_env === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  return token;
};

export default generateTokenAndSetCookies;
