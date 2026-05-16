import * as service from "./cart.service.js";

export const getAllCarts = async (req, res) => {
  try {
    const userId = req.authUser.id;

    const carts = await service.getAllCarts(userId);

    return res.status(200).json({ success: true, carts });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
  }
};
