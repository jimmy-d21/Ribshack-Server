import { storeInventoryModel as model } from "./inventory.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
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
  if (existingItem) {
    throw new Error(`"${itemName}" already exists in your inventory`);
  }

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
