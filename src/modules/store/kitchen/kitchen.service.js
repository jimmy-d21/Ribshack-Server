import { storeKitchenModel as model } from "./kitchen.model.js";

export const getKitchenOrders = async (branchId) => {
  const rows = await model.findKitchenOrders(branchId);

  return rows.map((r) => ({
    id: r.id,
    customerName: r.customerName,
    status: r.status,
    specialInstructions: r.specialInstructions ?? null,
    totalAmount: parseFloat(r.totalAmount),
    items: r.items ?? [],
  }));
};
