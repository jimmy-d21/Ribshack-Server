import * as service from "./address.service.js";

const resolveStatus = (message = "") => {
  const msg = message.toLowerCase();
  if (msg.includes("not found")) return 404;
  if (msg.includes("unauthorized")) return 401;
  if (msg.includes("forbidden")) return 403;
  if (
    msg.includes("invalid") ||
    msg.includes("must be") ||
    msg.includes("required")
  )
    return 400;
  return 500;
};

export const getAllAddress = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const addresses = await service.getAllAddress(userId);

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const getAddressDetails = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await service.getAddressDetails(addressId);

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = req.authUser.id;
    const newAddress = await service.addAddress(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      newAddress,
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
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
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    await service.deleteAddress(addressId);

    return res.status(200).json({
      success: true,
      message: "Address deteled successfully",
    });
  } catch (error) {
    return res
      .status(resolveStatus(error.message))
      .json({ success: false, message: error.message });
  }
};
