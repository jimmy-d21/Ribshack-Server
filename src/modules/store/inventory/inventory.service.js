import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { storeInventoryModel as model } from "./inventory.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return branch;
};

export const getAllInventory = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId);
};

export const getRequestKPIS = async (branchId) => {
  await validateBranch(branchId);

  const kpis = await model.getKPIs(branchId);

  return {
    adequateStock: kpis.adequateStock,
    lowStock: kpis.lowStock,
    criticalStock: kpis.criticalStock,
    pendingRequests: kpis.pendingRequests,
    pendingItemIds: kpis.pendingItemIds ?? [],
  };
};

export const getAllInventoryCritical = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId, { criticalOnly: true });
};

export const addInventoryItem = async (branchId, inventoryData) => {
  const {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  } = inventoryData;

  await validateBranch(branchId);

  const existingItem = await model.findByItemName(branchId, itemName);
  if (existingItem)
    throw new AppError(`"${itemName}" already exists in your inventory`, 409);

  return model.create(branchId, {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  });
};

export const getInventoryDetails = async (inventoryId) => {
  const inventoryItem = await model.findById(inventoryId);
  if (!inventoryItem) throw new AppError("Inventory item not found", 404);
  return inventoryItem;
};

export const updateInventory = async (inventoryId, inventoryData) => {
  const {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  } = inventoryData;

  const existingInventory = await model.findById(inventoryId);
  if (!existingInventory) throw new AppError("Inventory item not found", 404);

  if (itemName.toLowerCase() !== existingInventory.itemName.toLowerCase()) {
    const duplicate = await model.findByItemName(
      existingInventory.branchId,
      itemName,
    );
    if (duplicate)
      throw new AppError(`"${itemName}" already exists in your inventory`, 409);
  }

  return model.findByIdAndUpdate(inventoryId, {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  });
};

export const deleteInventory = async (inventoryId, branchId) => {
  const inventoryItem = await model.findById(inventoryId);
  if (!inventoryItem) throw new AppError("Inventory item not found", 404);

  if (branchId.toString() !== inventoryItem.branchId.toString()) {
    throw new AppError(
      "You are not authorized to delete this inventory item",
      403,
    );
  }

  return model.findByIdAndDelete(inventoryId);
};

export const inventoryRequest = async (
  inventoryId,
  branchId,
  quantity,
  urgency,
  notes,
) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await validateBranch(branchId);

    const existingItem = await model.findById(inventoryId);
    if (!existingItem) throw new AppError("Inventory item not found", 404);

    if (branchId.toString() !== existingItem.branchId.toString()) {
      throw new AppError(
        "You are not authorized to request restock for this inventory item",
        403,
      );
    }

    const inventoryRequest = await model.findOrCreateTodayRequest(
      client,
      branchId,
      urgency,
      notes,
    );

    await model.requestStockItem(
      client,
      inventoryRequest.request_id,
      inventoryId,
      quantity,
      notes,
    );

    const inventoryItem = await model.findById(inventoryId);

    await client.query("COMMIT");
    return { inventoryRequest, inventoryItem };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
