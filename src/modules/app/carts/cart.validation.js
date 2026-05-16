export const getAllCarts = (req, res, next) => {
  const userId = req.authUser.id;

  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  next();
};

export const addToCart = (req, res, next) => {
  const { branchId, productId, quantity, price, addOns } = req.body;

  if (!branchId || isNaN(branchId) || Number(branchId) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid branch ID" });
  }

  if (!productId || isNaN(productId) || Number(productId) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid quantity" });
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  if (addOns !== undefined && !Array.isArray(addOns)) {
    return res
      .status(400)
      .json({ success: false, message: "addOns must be an array" });
  }

  next();
};
