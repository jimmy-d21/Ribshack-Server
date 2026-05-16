const isValidId = (id) => id && !isNaN(id) && Number(id) > 0;

export const getAllAddress = (req, res, next) => {
  if (!isValidId(req.authUser?.id)) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access" });
  }
  next();
};

export const getAddressDetails = (req, res, next) => {
  if (!isValidId(req.params.addressId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid address ID" });
  }
  next();
};

export const deleteAddress = getAddressDetails;
export const setDefaultAddress = getAddressDetails;

export const addAddress = (req, res, next) => {
  const {
    label,
    fullAddress,
    city,
    province,
    postalCode,
    landMark,
    isDefault,
  } = req.body;

  if (!fullAddress || typeof fullAddress !== "string" || !fullAddress.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Full address is required" });
  }
  if (!city || typeof city !== "string" || !city.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "City is required" });
  }
  if (label !== undefined && (typeof label !== "string" || !label.trim())) {
    return res.status(400).json({
      success: false,
      message: "Address label must be a non-empty text",
    });
  }
  if (
    province !== undefined &&
    (typeof province !== "string" || !province.trim())
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Province must be a non-empty text" });
  }
  if (
    postalCode !== undefined &&
    (typeof postalCode !== "string" || !postalCode.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Postal code must be a non-empty text",
    });
  }
  if (isDefault !== undefined && typeof isDefault !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "isDefault must be a boolean value" });
  }

  next();
};

export const updateAddress = (req, res, next) => {
  if (!isValidId(req.params.addressId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid address ID" });
  }
  return addAddress(req, res, next);
};
