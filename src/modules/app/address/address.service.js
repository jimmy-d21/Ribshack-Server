import AppError from "../../../utils/AppError.js";
import { appAddressModel as model } from "./address.model.js";

export const getAllAddress = async (userId) => {
  return model.findAddressesByUserId(userId);
};

export const getAddressDetails = async (addressId, userId) => {
  const address = await model.findAddressByIdAndUser(addressId, userId);
  if (!address) throw new AppError("Address not found", 404);
  return address;
};

export const addAddress = async (userId, addressData) => {
  const isDefault = addressData.isDefault || false;

  const newAddress = await model.createAddress(userId, {
    ...addressData,
    isDefault,
  });

  if (isDefault) {
    await model.updateAllAddressDefault(userId, newAddress.id);
  }

  return newAddress;
};

export const updateAddress = async (addressId, userId, addressData) => {
  const existingAddress = await model.findAddressByIdAndUser(addressId, userId);
  if (!existingAddress) throw new AppError("Address not found", 404);

  const shouldBeDefault =
    addressData.isDefault !== undefined
      ? addressData.isDefault
      : existingAddress.isDefault;

  if (shouldBeDefault) {
    await model.updateAllAddressDefault(userId, addressId);
  }

  return model.updateAddress(addressId, userId, {
    label: addressData.label || existingAddress.label,
    fullAddress: addressData.fullAddress || existingAddress.fullAddress,
    landMark:
      addressData.landMark !== undefined
        ? addressData.landMark
        : existingAddress.landMark,
    city: addressData.city || existingAddress.city,
    province: addressData.province || existingAddress.province,
    postalCode: addressData.postalCode || existingAddress.postalCode,
    isDefault: shouldBeDefault,
  });
};

export const deleteAddress = async (addressId, userId) => {
  const address = await model.findAddressByIdAndUser(addressId, userId);
  if (!address) throw new AppError("Address not found", 404);
  return model.deleteAddress(addressId, userId);
};

export const setDefaultAddress = async (addressId, userId) => {
  const address = await model.findAddressByIdAndUser(addressId, userId);
  if (!address) throw new AppError("Address not found", 404);

  await model.updateAllAddressDefault(userId, addressId);
  return model.setDefaultAddress(addressId, userId);
};
