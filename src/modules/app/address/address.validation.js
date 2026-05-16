export const addAddress = (req, res, next) => {
  const { label, fullAddress, city, province, postalCode } = req.body;

  if (
    !fullAddress ||
    typeof fullAddress !== "string" ||
    fullAddress.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Full address is required",
    });
  }

  if (!city || typeof city !== "string" || city.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "City is required",
    });
  }

  if (
    label !== undefined &&
    (typeof label !== "string" || label.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Address label must be a non-empty text",
    });
  }

  if (
    province !== undefined &&
    (typeof province !== "string" || province.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Province must be a non-empty text",
    });
  }

  if (
    postalCode !== undefined &&
    (typeof postalCode !== "string" || postalCode.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Postal code must be a non-empty text",
    });
  }

  next();
};

export const getAllAddress = (req, res, next) => {
  const userId = req.authUser?.id;

  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};

export const getAddressDetails = (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId || isNaN(addressId) || Number(addressId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid address ID",
    });
  }

  next();
};

export const updateAddress = (req, res, next) => {
  const {
    label,
    fullAddress,
    city,
    province,
    postalCode,
    landMark,
    isDefault,
  } = req.body;

  if (
    fullAddress !== undefined &&
    (typeof fullAddress !== "string" || fullAddress.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Full address must be a non-empty text",
    });
  }

  if (city !== undefined && (typeof city !== "string" || city.trim() === "")) {
    return res.status(400).json({
      success: false,
      message: "City must be a non-empty text",
    });
  }

  if (
    label !== undefined &&
    (typeof label !== "string" || label.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Address label must be a non-empty text",
    });
  }

  if (
    province !== undefined &&
    (typeof province !== "string" || province.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Province must be a non-empty text",
    });
  }

  if (
    postalCode !== undefined &&
    (typeof postalCode !== "string" || postalCode.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Postal code must be a non-empty text",
    });
  }

  if (isDefault !== undefined && typeof isDefault !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "isDefault must be a boolean",
    });
  }

  next();
};

export const deleteAddress = (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId || isNaN(addressId) || Number(addressId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid address ID",
    });
  }

  next();
};

export const setDefaultAddress = (req, res, next) => {
  const { addressId } = req.params;

  if (!addressId || isNaN(addressId) || Number(addressId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid address ID",
    });
  }

  next();
};
