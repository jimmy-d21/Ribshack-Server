import resolveStatus from "../../../utils/resolveStatus.js";
import * as service from "./order.service.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const newOrder = await service.createOrder(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Order placed! Salamat!",
      newOrder,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};
