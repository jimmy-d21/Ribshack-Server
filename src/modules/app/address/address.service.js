import { appAddressModel as model } from "./address.model.js";

export const getAllAddress = async (userId) => {
  const addresses = await model.findAddressesByUserId(userId);
  return addresses;
};

export const addAddress = async (userId, addressData) => {
  const { label, fullAddress, city, province, postalCode, landMark } =
    addressData;

  const existingAddresses = await model.findAddressesByUserId(userId);
  const isDefault = existingAddresses.length === 0;

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
