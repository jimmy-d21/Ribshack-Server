import { appAddressModel as model } from "./address.model.js";

export const addAddress = async (userId, addressData) => {
  return await model.createAddress(userId, addressData);
};
