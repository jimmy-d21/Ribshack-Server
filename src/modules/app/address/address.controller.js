import * as service from "./address.service.js";

const resolveStatus = (message = "") => {
  const msg = message.toLowerCase();
  if (msg.includes("not found")) return 404;
  if (msg.includes("unauthorized")) return 401;
  if (msg.includes("forbidden")) return 403;
  if (
    msg.includes("invalid") ||
    msg.includes("must be") ||
    msg.includes("required")
  )
    return 400;
  return 500;
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const newAddress = await service.addAddress(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};
