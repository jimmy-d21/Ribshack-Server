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

    // Reuse existing cart or create a new one
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

    // Insert each add-on
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
