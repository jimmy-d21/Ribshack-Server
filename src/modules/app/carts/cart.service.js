import { appCartModel as model } from "./cart.model.js";
import db from "../../../config/db.js";

export const getAllCarts = async (userId) => {
  const carts = await model.findAll(userId);
  return carts;
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

    // pass client correctly
    const cartItem = await model.findCartItem(client, itemId);
    if (!cartItem) throw new Error("Cart item not found");

    // price from body is the unit price; pass it as unitPrice
    const newCartItem = await model.updateCartItem(client, itemId, {
      quantity,
      unitPrice: price,
    });

    // Delete all old addons then re-insert
    await model.deleteAllAddons(client, itemId);

    for (const addOn of addOns) {
      await model.createCartAddon(client, newCartItem.cart_item_id, {
        addonId: addOn.id,
        addonName: addOn.name,
        addonPrice: addOn.price,
      });
    }

    await client.query("COMMIT");

    // return newCartItem, not the stale cartItem
    return newCartItem;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
export const deleteCartItem = async (itemId) => {
  const cartItem = await model.findCartItem(db, itemId);
  if (!cartItem) throw new Error("Cart item not found");

  const deletedItem = await model.deleteCartItem(itemId);
  return deletedItem;
};

export const deleteAllCartItem = async (userId) => {
  const cart = await model.findCartByUserId(db, userId);

  if (!cart) return [];

  const deletedItems = await model.deleteAllCartItems(cart.cart_id);
  return deletedItems;
};
