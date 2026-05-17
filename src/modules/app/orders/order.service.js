import db from "../../../config/db.js";
import { appOrdersModel as model } from "./order.model.js";

export const getAllOrders = async (userId) => {
  const orders = await model.findAllOrders(userId);
  return orders;
};

export const getOrderDetails = async (orderId, userId) => {
  const order = await model.findOrderById(orderId, userId);
  if (!order) throw new Error("Order not found");

  return order;
};

export const createOrder = async (userId, orderData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { paymentMethod, branchId, instructions } = orderData;

    const carts = await model.findAll(client, userId);
    if (carts.length === 0) throw new Error("Cart is empty");

    const address = await model.findAddressesByUserId(client, userId);
    if (!address) throw new Error("Please add a delivery address first");

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

    const newOrder = await model.createOrder(
      client,
      userId,
      branchId,
      totalAmount,
      paymentMethod,
    );

    for (const cart of carts) {
      const drinksTotal = cart.addons.drinks.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      const extrasTotal = cart.addons.extras.reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );

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

      for (const addon of cart.addons.drinks) {
        await model.createOrderItemAddon(client, orderItem.orderItemId, {
          addonId: addon.id,
          addonName: addon.name,
          addonPrice: addon.price,
        });
      }

      for (const addon of cart.addons.extras) {
        await model.createOrderItemAddon(client, orderItem.orderItemId, {
          addonId: addon.id,
          addonName: addon.name,
          addonPrice: addon.price,
        });
      }
    }

    await model.createOrderPayment(
      client,
      newOrder.orderId,
      paymentMethod,
      totalAmount,
    );

    if (instructions && instructions.trim() !== "") {
      await model.createOrderInstruction(
        client,
        newOrder.orderId,
        instructions,
      );
    }

    await model.createDeliveryOrder(
      client,
      newOrder.orderId,
      address.id,
      address.fullAddress,
      address.city,
    );

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
