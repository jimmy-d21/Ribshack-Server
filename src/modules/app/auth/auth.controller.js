import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import * as service from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const newUser = await service.register(req.body);
    const token = generateTokenAndSetCookies(res, newUser.user_id, "customer");

    return res.status(201).json({
      success: true,
      message: "Account created! Welcome!",
      newUser,
      token,
    });
  } catch (error) {
    const isDuplicate = error.message.includes("already exists");
    return res
      .status(isDuplicate ? 409 : 500)
      .json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await service.login(req.body);
    const token = generateTokenAndSetCookies(res, user.id, "customer");

    return res.status(200).json({
      success: true,
      message: "Welcome back!",
      user,
      token,
    });
  } catch (error) {
    const isInvalidCredentials = error.message.includes("Invalid credentials");
    return res
      .status(isInvalidCredentials ? 401 : 500)
      .json({ success: false, message: error.message });
  }
};
