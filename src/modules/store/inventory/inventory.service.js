import db from "../../../config/db.js";
import { storeInventoryModel as model } from "./inventory.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId); // no longer passing undefined
  if (!branch) throw new Error("Branch not found");
  return branch;
};

export const getAllInventory = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId);
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
    throw new Error(`"${itemName}" already exists in your inventory`);

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
  if (!inventoryItem) throw new Error("Inventory item not found");
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
  if (!existingInventory) throw new Error("Inventory item not found");

  if (itemName.toLowerCase() !== existingInventory.itemName.toLowerCase()) {
    const existingItem = await model.findByItemName(
      existingInventory.branchId,
      itemName,
    );
    if (existingItem)
      throw new Error(`"${itemName}" already exists in your inventory`);
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
  if (!inventoryItem) throw new Error("Inventory item not found");

  if (branchId.toString() !== inventoryItem.branchId.toString()) {
    throw new Error("You're not authorized to delete this inventory item");
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

    const inventoryItem = await model.findById(inventoryId);
    if (!inventoryItem) throw new Error("Inventory item not found");

    if (branchId.toString() !== inventoryItem.branchId.toString()) {
      throw new Error(
        "You're not authorized to request restock for this inventory item",
      );
    }

    const newInventoryRequest = await model.requestStock(
      client,
      branchId,
      urgency,
      notes,
    );

    await model.requestStockItem(
      client,
      newInventoryRequest.request_id,
      inventoryId,
      quantity,
      notes,
    );

    await client.query("COMMIT");
    return newInventoryRequest;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
