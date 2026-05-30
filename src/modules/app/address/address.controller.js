import asyncHandler from "../../../utils/asyncHandler.js";
import * as service from "./address.service.js";

export const getAllAddress = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const addresses = await service.getAllAddress(userId);
  return res.status(200).json({ success: true, addresses });
});

export const getAddressDetails = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.authUser.id;
  const address = await service.getAddressDetails(addressId, userId);
  return res.status(200).json({ success: true, address });
});

export const addAddress = asyncHandler(async (req, res) => {
  const userId = req.authUser.id;
  const newAddress = await service.addAddress(userId, req.body);
  return res.status(201).json({
    success: true,
    message: "Address added successfully",
    newAddress,
  });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.authUser.id;
  const updatedAddress = await service.updateAddress(
    addressId,
    userId,
    req.body,
  );
  return res.status(200).json({
    success: true,
    message: "Address updated successfully",
    updatedAddress,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.authUser.id;
  await service.deleteAddress(addressId, userId);
  return res
    .status(200)
    .json({ success: true, message: "Address deleted successfully" });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const userId = req.authUser.id;
  const defaultAddress = await service.setDefaultAddress(addressId, userId);
  return res.status(200).json({
    success: true,
    message: "Default address updated successfully",
    defaultAddress,
  });
});
