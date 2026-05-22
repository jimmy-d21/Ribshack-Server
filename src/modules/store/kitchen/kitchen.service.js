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
