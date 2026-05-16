import * as service from "./cart.service.js";

const resolveStatus = (message) => {
  const statusMap = {
    "not found": 404,
    unauthorized: 401,
    forbidden: 403,
  };
  const msg = message.toLowerCase();
  return (
    Object.entries(statusMap).find(([key]) => msg.includes(key))?.[1] ?? 500
  );
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
    const updatedCart = await service.updateCart(itemId, req.body);

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
    const deletedItem = await service.deleteCartItem(itemId);

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
