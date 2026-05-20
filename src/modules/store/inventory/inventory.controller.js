import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./inventory.service.js";

export const getAllInventory = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const inventory = await service.getAllInventory(branchId);
  return res.status(200).json({ success: true, inventory });
});

export const getAllInventoryCritical = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const inventory = await service.getAllInventoryCritical(branchId);
  return res.status(200).json({ success: true, inventory });
});

export const addInventoryItem = asyncHandler(async (req, res) => {
  const branchId = req.authUser.id;
  const newInventoryItem = await service.addInventoryItem(branchId, req.body);
  return res.status(201).json({
    success: true,
    message: "New inventory item added",
    newInventoryItem,
  });
});

export const getInventoryDetails = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const inventoryItem = await service.getInventoryDetails(itemId);
  return res.status(200).json({ success: true, inventoryItem });
});

export const updateInventory = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const updatedInventoryItem = await service.updateInventory(itemId, req.body);
  return res.status(200).json({
    success: true,
    message: "Inventory item updated successfully",
    updatedInventoryItem,
  });
});

export const deleteInventory = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const branchId = req.authUser.id;
  await service.deleteInventory(itemId, branchId);
  return res
    .status(200)
    .json({ success: true, message: "Inventory item deleted successfully" });
});

export const inventoryRequest = asyncHandler(async (req, res) => {
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
});
