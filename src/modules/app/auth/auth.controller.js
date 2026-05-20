import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const newUser = await service.register(req.body);
  const token = generateTokenAndSetCookies(res, newUser.id, "customer");
  return res.status(201).json({
    success: true,
    message: "Account created! Welcome!",
    newUser,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await service.login(req.body);
  const token = generateTokenAndSetCookies(res, user.id, "customer");
  return res.status(200).json({
    success: true,
    message: "Welcome back!",
    user,
    token,
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await service.me(req.authUser.id);
  return res.status(200).json({ success: true, user });
});
