import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const branch = await service.login(username, password);
  const token = generateTokenAndSetCookies(res, branch.id, "branch");
  return res
    .status(200)
    .json({ success: true, message: "Welcome back!", branch, token });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("branch_token", "", { httpOnly: true, expires: new Date(0) });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully" });
});

export const me = asyncHandler(async (req, res) => {
  const branch = await service.me(req.authUser.id);
  return res.status(200).json({ success: true, branch });
});
