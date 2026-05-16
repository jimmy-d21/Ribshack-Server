import * as service from "./cart.service.js";

const resolveStatus = (message = "") => {
  const msg = message.toLowerCase();
  if (msg.includes("not found")) return 404;
  if (msg.includes("unauthorized")) return 401;
  if (msg.includes("forbidden")) return 403;
  if (msg.includes("invalid") || msg.includes("must be")) return 400;
  return 500;
};

export const getAllCarts = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const carts = await service.getAllCarts(userId);
    return res.status(200).json({ success: true, carts });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const newCartItem = await service.addToCart(userId, req.body);
    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      newCartItem,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedCart = await service.updateCart(Number(itemId), req.body);
    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      updatedCart,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await service.deleteCartItem(Number(itemId));
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      deletedItem,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const deleteAllCartItem = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const deletedItems = await service.deleteAllCartItem(userId);
    return res.status(200).json({
      success: true,
      message: "All cart items cleared successfully",
      deletedItems,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};
