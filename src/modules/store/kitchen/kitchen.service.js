import { storeKitchenModel as model } from "./kitchen.model.js";

export const getOrders = async (branchId) => {
  const rows = await model.findOrders(branchId);

  return rows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    status: r.status,
    specialInstructions: r.specialInstructions ?? null,
    totalAmount: parseFloat(r.totalAmount),
    items: r.items ?? [],
  }));
};

export const getOrderDetails = async (orderId, branchId) => {
  const raw = await model.findOrderDetails(orderId, branchId);

  if (!raw) throw new AppError("Order not found", 404);

  return {
    id: raw.id,
    customerName: raw.customerName,
    status: raw.status,
    orderReceivedAt: raw.orderReceivedAt,
    deliveryAddress: raw.deliveryAddress,
    specialInstructions: raw.specialInstructions ?? null,
    totalAmount: parseFloat(raw.totalAmount),
    items: raw.items ?? [],
  };
};

export const updateOrderStatus = async (orderId, branchId) => {
  const ORDER_STATUSES = ["PLACED", "PREPARING", "READY", "OUT_FOR_DELIVERY"];
  const order = await model.findOrderById(orderId, branchId);

  if (!order) throw new AppError("Order not found", 404);

  const currentIndex = ORDER_STATUSES.indexOf(order.status);

  if (currentIndex === -1 || currentIndex === ORDER_STATUSES.length - 1) {
    throw new AppError(
      `Order is already at the final status: ${order.status}`,
      400,
    );
  }

  const nextStatus = ORDER_STATUSES[currentIndex + 1];

  await model.updateOrderById(orderId, branchId, nextStatus);

  await model.createStatusLog(orderId, nextStatus);

  const updatedOrder = await model.findOrderById(orderId, branchId);
  return updatedOrder;
};
