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

  return newAddress;
};
