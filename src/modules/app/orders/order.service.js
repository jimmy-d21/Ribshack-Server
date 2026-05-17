import db from "../../../config/db.js";
import { appOrdersModel as model } from "./order.model.js";

export const createOrder = async (userId, orderData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { paymentMethod, branchId, instructions } = orderData;

    // Validate cart is not empty
    const carts = await model.findAll(client, userId);
    if (carts.length === 0) throw new Error("Cart is empty");

    // Validate default address exists
    const address = await model.findAddressesByUserId(client, userId);
    if (!address) throw new Error("Please add a delivery address first");

    // Correctly compute total — sum of (item price + all addon prices) per cart item
    const totalAmount = carts.reduce((sum, item) => {
      const drinksTotal = item.addons.drinks.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      const extrasTotal = item.addons.extras.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      return sum + Number(item.price) + drinksTotal + extrasTotal;
    }, 0);

    // Create the order
    const newOrder = await model.createOrder(
      client,
      userId,
      branchId,
      totalAmount,
      paymentMethod,
    );

    // Create order items and their addons
    for (const cart of carts) {
      const drinksTotal = cart.addons.drinks.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      const extrasTotal = cart.addons.extras.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );

      // Correctly compute per-item values
      const addonsTotal = drinksTotal + extrasTotal;
      const unitPrice = Number(cart.price) / cart.quantity;
      const subtotal = Number(cart.price) + addonsTotal;

      const orderItem = await model.createOrderItem(
        client,
        newOrder.orderId,
        cart.productId,
        cart.quantity,
        unitPrice,
        addonsTotal,
        subtotal,
      );

      // Insert order item addons — drinks
      for (const addon of cart.addons.drinks) {
        await model.createOrderItemAddon(client, orderItem.orderItemId, {
          addonId: addon.id,
          addonName: addon.name,
          addonPrice: addon.price,
        });
      }

      // Insert order item addons — extras
      for (const addon of cart.addons.extras) {
        await model.createOrderItemAddon(client, orderItem.orderItemId, {
          addonId: addon.id,
          addonName: addon.name,
          addonPrice: addon.price,
        });
      }
    }

    // Create payment record
    await model.createOrderPayment(
      client,
      newOrder.orderId,
      paymentMethod,
      totalAmount,
    );

    // Only create instruction if provided
    if (instructions && instructions.trim() !== "") {
      await model.createOrderInstruction(
        client,
        newOrder.orderId,
        instructions,
      );
    }

    // Clear the cart after successful order
    await model.clearCart(client, userId);

    await client.query("COMMIT");
    return newOrder;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
