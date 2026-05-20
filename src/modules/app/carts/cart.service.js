import AppError from "../../../utils/AppError.js";
import { appCartModel as model } from "./cart.model.js";
import db from "../../../config/db.js";

export const getAllCarts = async (userId) => {
  return model.findAll(userId);
};

export const addToCart = async (userId, cartData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { branchId, productId, quantity, price, addOns = [] } = cartData;

    let cart = await model.findCartByUserId(client, userId);
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

    const { quantity, price, addOns = [] } = cartData;

    const cartItem = await model.findCartItem(client, itemId);
    if (!cartItem) throw new AppError("Cart item not found", 404);

    const updatedCartItem = await model.updateCartItem(client, itemId, {
      quantity,
      unitPrice: price,
    });

    // Replace all add-ons with the incoming set
    await model.deleteAllAddons(client, itemId);

    for (const addOn of addOns) {
      await model.createCartAddon(client, updatedCartItem.cart_item_id, {
        addonId: addOn.id,
        addonName: addOn.name,
        addonPrice: addOn.price,
      });
    }

    await client.query("COMMIT");
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

export const deleteAllCartItem = async (userId) => {
  const cart = await model.findCartByUserId(db, userId);
  if (!cart) return [];
  return model.deleteAllCartItems(cart.cart_id);
};
