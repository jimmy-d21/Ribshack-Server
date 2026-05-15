import * as service from "./inventory.service.js";

export const getAllInventory = async (req, res) => {
  try {
    const branchId = req.authUser.id;

    const inventory = await service.getAllInventory(branchId);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const getAllInventoryCritical = async (req, res) => {
  try {
    const branchId = req.authUser.id;

    const inventory = await service.getAllInventoryCritical(branchId);

    return res.status(200).json(inventory);
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};

export const addInventoryItem = async (req, res) => {
  try {
    const branchId = req.authUser.id;
    const newInventoryItem = await service.addInventoryItem(branchId, req.body);

    return res.status(201).json({
      success: true,
      message: "New inventory item added",
      newInventoryItem,
    });
  } catch (error) {
    const isDuplicate = error.message.includes("already exists");
    return res.status(isDuplicate ? 409 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getInventoryDetails = async (req, res) => {
  try {
    const { itemId } = req.params;
    const inventoryItem = await service.getInventoryDetails(itemId);

    return res.status(200).json({
      success: true,
      inventoryItem,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updatedInventoryItem = await service.updateInventory(
      itemId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Updated inventory item successfully",
      updatedInventoryItem,
    });
  } catch (error) {
    const isDuplicate = error.message.includes("already exists");
    const isNotFound = error.message.includes("not found");
    return res.status(isDuplicate ? 409 : isNotFound ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};
