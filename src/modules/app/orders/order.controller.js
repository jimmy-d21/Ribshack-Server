import resolveStatus from "../../../utils/resolveStatus.js";

import * as service from "./order.service.js";

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const orders = await service.getAllOrders(userId);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.authUser.id;

    const order = await service.getOrderDetails(orderId, userId);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

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
