import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import generateOrderNumber from "../../../utils/generateOrderNumber.js";
import { appOrdersModel as model } from "./order.model.js";

export const getAllOrders = async (userId) => {
  return model.findAllOrders(userId);
};

export const getOrderDetails = async (orderId, userId) => {
  const order = await model.findOrderById(orderId, userId);
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

export const createOrder = async (userId, orderData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const { paymentMethod, branchId, instructions } = orderData;

    const carts = await model.findAll(client, userId, branchId);

    if (carts.length === 0) throw new AppError("Cart is empty", 400);

    const address = await model.findAddressesByUserId(client, userId);
    if (!address)
      throw new AppError("Please add a delivery address first", 400);

    const totalAmount = carts.reduce((sum, item) => {
      const quantity = Number(item.quantity);
      const basePrice = Number(item.unitPrice);

      const drinksTotal = (item.addons?.drinks || []).reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      const extrasTotal = (item.addons?.extras || []).reduce(
        (acc, addon) => acc + Number(addon.price),
        0,
      );
      const itemTotal = (basePrice + drinksTotal + extrasTotal) * quantity;
      return sum + itemTotal;
    }, 0);

    let orderNumber;
    let isDuplicate = true;

    while (isDuplicate) {
      orderNumber = generateOrderNumber();
      isDuplicate = await model.orderNumberExists(client, orderNumber);
    }

    const orderType = "DELIVERY";

    const newOrder = await model.createOrder(
      client,
      userId,
      branchId,
      totalAmount,
      paymentMethod,
      orderNumber,
      orderType,
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
      const addonsTotal = Number(drinksTotal + extrasTotal) * cart.quantity;
      const unitPrice = Number(cart.price);
      const subtotal = Number(cart.price * cart.quantity);

      const orderItem = await model.createOrderItem(
        client,
        newOrder.orderId,
        cart.productId,
        cart.quantity,
        unitPrice,
        addonsTotal,
        subtotal,
      );

      for (const addon of [...cart.addons.drinks, ...cart.addons.extras]) {
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

    await model.createOrderStatusLogs(client, newOrder.orderId, "PLACED");

    await model.clearCart(client, userId);

    const user = await model.findUserById(client, userId);

    const title = "New Order Received";
    const message = `ORD-${newOrder.orderNumber.split("-")[1]} from ${user.full_name}`;
    const type = "NEW_ORDER";

    await model.createNotification(client, branchId, title, message, type);

    await client.query("COMMIT");

    const order = await model.findOrderById(newOrder.orderId, userId);
    console.log("NewOrder", order);

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteOrder = async (orderId, userId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const order = await model.findOrderById(orderId, userId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.status !== "PLACED") {
      throw new AppError("Only placed orders can be cancelled", 400);
    }

    await model.createOrderStatusLogs(client, orderId, "CANCELLED");
    await model.updateOrderStatus(client, orderId, "CANCELLED");

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
