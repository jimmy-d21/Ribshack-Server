import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await service.login(email, password);
  generateTokenAndSetCookies(res, admin.admin_id, "admin");
  return res
    .status(200)
    .json({ success: true, message: "Login successfully", admin });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully" });
});

export const me = asyncHandler(async (req, res) => {
  const admin = await service.me(req.authUser.id);
  return res.status(200).json({ success: true, admin });
});
