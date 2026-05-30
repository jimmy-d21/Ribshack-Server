import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { appAddressModel as model } from "./address.model.js";

export const getAllAddress = async (userId) => {
  return model.findAddressesByUserId(db, userId);
};

export const getAddressDetails = async (addressId, userId) => {
  const address = await model.findAddressByIdAndUser(db, addressId, userId);
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
    await model.updateAllAddressDefault(db, userId, newAddress.id);
  }

  return newAddress;
};

export const updateAddress = async (addressId, userId, addressData) => {
  const existingAddress = await model.findAddressByIdAndUser(
    db,
    addressId,
    userId,
  );
  if (!existingAddress) throw new AppError("Address not found", 404);

  const shouldBeDefault =
    addressData.isDefault !== undefined
      ? addressData.isDefault
      : existingAddress.isDefault;

  if (shouldBeDefault) {
    await model.updateAllAddressDefault(db, userId, addressId);
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
  const address = await model.findAddressByIdAndUser(db, addressId, userId);
  if (!address) throw new AppError("Address not found", 404);

  const isDeletingDefault = address.isDefault;

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await model.deleteAddress(client, addressId, userId);

    if (isDeletingDefault) {
      const remainingAddresses = await model.findAddressesByUserId(
        client,
        userId,
      );

      const activeAddresses = remainingAddresses.filter(
        (addr) => addr.id !== Number(addressId),
      );

      if (activeAddresses.length > 0) {
        const newDefaultId = activeAddresses[0].id;
        await model.updateAllAddressDefault(client, userId, newDefaultId);
        await model.setDefaultAddress(client, newDefaultId, userId);
      }
    }

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const setDefaultAddress = async (addressId, userId) => {
  const address = await model.findAddressByIdAndUser(db, addressId, userId);
  if (!address) throw new AppError("Address not found", 404);

  await model.updateAllAddressDefault(db, userId, addressId);
  return model.setDefaultAddress(db, addressId, userId);
};
