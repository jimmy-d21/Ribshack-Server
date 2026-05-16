import { appAddressModel as model } from "./address.model.js";

export const getAllAddress = async (userId) => {
  const addresses = await model.findAddressesByUserId(userId);
  return addresses;
};

export const getAddressDetails = async (addressId) => {
  const address = await model.findAddressById(addressId);
  if (!address) throw new Error("Address not found");

  return address;
};

export const addAddress = async (userId, addressData) => {
  const {
    label,
    fullAddress,
    city,
    province,
    postalCode,
    landMark,
    isDefault,
  } = addressData;

  const newAddress = await model.createAddress(userId, {
    label,
    fullAddress,
    city,
    province,
    postalCode,
    landMark,
    isDefault,
  });

  // Set all user address into false except the addressId
  if (isDefault) {
    await model.updateAllAddressDefault(userId, newAddress.id);
  }

  return newAddress;
};

export const updateAddress = async (addressId, userId, addressData) => {
  const {
    label,
    fullAddress,
    city,
    province,
    postalCode,
    landMark,
    isDefault,
  } = addressData;

  const existingAddress = await model.findAddressById(addressId);
  if (!existingAddress) throw new Error("Address not found");

  // Set all user address into false except the addressId
  await model.updateAllAddressDefault(userId, addressId);

  const updatedAddress = await model.updateAddress(addressId, {
    label: label || existingAddress.label,
    fullAddress: fullAddress || existingAddress.fullAddress,
    landMark,
    city: city || existingAddress.city,
    province: province || existingAddress.province,
    postalCode: postalCode || existingAddress.postalCode,
    isDefault,
  });

  return updatedAddress;
};
