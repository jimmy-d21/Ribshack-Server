import AppError from "../../../utils/AppError.js";
import { appCartModel as model } from "./cart.model.js";
import db from "../../../config/db.js";

export const getAllCarts = async (userId, branchId) => {
  return model.findAll(userId, branchId);
};

export const addToCart = async (userId, cartData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { branchId, productId, quantity, price, addOns = [] } = cartData;

    let cart = await model.findCartByUserId(client, userId, branchId);
    if (!cart) {
      cart = await model.createCart(client, userId, branchId);
    }

    const cartId = cart.cart_id;

    const newCartItem = await model.createCartItem(client, {
      cartId,
      productId,
      quantity,
      unitPrice: price,
    });

    for (const addOn of addOns) {
      await model.createCartAddon(client, newCartItem.cart_item_id, {
        addonId: addOn.id,
        addonName: addOn.name,
        addonPrice: addOn.price,
      });
    }

    await client.query("COMMIT");
    return newCartItem;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateCart = async (itemId, cartData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { quantity, addOns = [] } = cartData;

    const cartItem = await model.findCartItem(client, itemId);
    if (!cartItem) throw new AppError("Cart item not found", 404);

    const result = await model.updateCartItem(client, itemId, quantity);

    await model.deleteAllAddons(client, itemId);
    for (const addOn of addOns) {
      await model.createCartAddon(client, itemId, {
        addonId: addOn.id,
        addonName: addOn.name,
        addonPrice: addOn.price,
      });
    }

    await client.query("COMMIT");

    const updatedCartItem = await model.findCartItem(client, itemId);

    return updatedCartItem;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteCartItem = async (itemId) => {
  const cartItem = await model.findCartItem(db, itemId);
  if (!cartItem) throw new AppError("Cart item not found", 404);
  return model.deleteCartItem(itemId);
};

export const deleteAllCartItem = async (userId, branchId) => {
  const cart = await model.findCartByUserId(db, userId, branchId);
  if (!cart) return [];
  return model.deleteAllCartItems(cart.cart_id, branchId);
};
