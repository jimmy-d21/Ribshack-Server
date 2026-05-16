export const addAddress = (req, res, next) => {
  const { label, fullAddress, city, province, postalCode } = req.body;

  if (!label || !fullAddress || !city || !province || !postalCode) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide all required fields: label, fullAddress, city, province, and postalCode",
    });
  }

  if (typeof label !== "string" || label.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or empty address label" });
  }

  if (typeof fullAddress !== "string" || fullAddress.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Full address is required and must be text",
    });
  }

  if (typeof city !== "string" || city.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "City is required and must be text" });
  }

  if (typeof province !== "string" || province.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Province is required and must be text",
    });
  }

  if (typeof postalCode !== "string" || postalCode.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Postal code is required" });
  }

  next();
};
