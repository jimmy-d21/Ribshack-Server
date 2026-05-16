export const addAddress = (req, res, next) => {
  const { label, fullAddress, city, province, postalCode, landMark } = req.body;

  // Required fields
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

  // Optional fields — only validate type if provided
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

  if (
    landMark !== undefined &&
    (typeof landMark !== "string" || landMark.trim() === "")
  ) {
    return res.status(400).json({
      success: false,
      message: "Landmark must be a non-empty text",
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
