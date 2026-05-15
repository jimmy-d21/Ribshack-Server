import generateTokenAndSetCookies from "../../../utils/generateTokenAndSetCookies.js";
import * as service from "./auth.service.js";

export const register = async (req, res) => {
  try {
    const newUser = await service.register(req.body);

    const token = generateTokenAndSetCookies(res, newUser.id, "customer");

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
