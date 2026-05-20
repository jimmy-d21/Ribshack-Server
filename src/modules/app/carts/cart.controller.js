import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./cart.service.js";

export const getAllCarts = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const carts = await service.getAllCarts(userId);
  return res.status(200).json({ success: true, carts });
});

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const newCartItem = await service.addToCart(userId, req.body);
  return res.status(201).json({
    success: true,
    message: "Item added to cart successfully",
    newCartItem,
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const updatedCart = await service.updateCart(Number(itemId), req.body);
  return res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    updatedCart,
  });
});

export const deleteCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const deletedItem = await service.deleteCartItem(Number(itemId));
  return res.status(200).json({
    success: true,
    message: "Cart item deleted successfully",
    deletedItem,
  });
});

export const deleteAllCartItem = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const deletedItems = await service.deleteAllCartItem(userId);
  return res.status(200).json({
    success: true,
    message: "All cart items cleared successfully",
    deletedItems,
  });
});
