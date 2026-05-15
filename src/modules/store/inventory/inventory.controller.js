import * as service from "./inventory.service.js";

export const getAllInventory = async (req, res) => {
  try {
    const branchId = req.authUser.id;
    const inventory = await service.getAllInventory(branchId);

    return res.status(200).json({
      success: true, // added
      inventory,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res
      .status(isNotFound ? 404 : 500) //  was 401
      .json({ success: false, message: error.message });
  }
};

export const getAllInventoryCritical = async (req, res) => {
  try {
    const branchId = req.authUser.id;
    const inventory = await service.getAllInventoryCritical(branchId);

    return res.status(200).json({
      success: true, // added
      inventory,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    return res
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
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
    return res
      .status(isDuplicate ? 409 : 500)
      .json({ success: false, message: error.message });
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
    return res
      .status(isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
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
    return res
      .status(isDuplicate ? 409 : isNotFound ? 404 : 500)
      .json({ success: false, message: error.message });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const { itemId } = req.params;
    const branchId = req.authUser.id;

    await service.deleteInventory(itemId, branchId);

    return res.status(200).json({
      success: true,
      message: "Deleted inventory item successfully",
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    const isUnauthorized = error.message.includes("not authorized");
    return res
      .status(isNotFound ? 404 : isUnauthorized ? 403 : 500)
      .json({ success: false, message: error.message });
  }
};

export const inventoryRequest = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, urgency, notes } = req.body;
    const branchId = req.authUser.id;

    const newInventoryRequest = await service.inventoryRequest(
      itemId,
      branchId,
      quantity,
      urgency,
      notes,
    );

    return res.status(201).json({
      success: true,
      message: "Inventory restock request submitted successfully",
      newInventoryRequest,
    });
  } catch (error) {
    const isNotFound = error.message.includes("not found");
    const isUnauthorized = error.message.includes("not authorized");
    return res
      .status(isNotFound ? 404 : isUnauthorized ? 403 : 500)
      .json({ success: false, message: error.message });
  }
};
