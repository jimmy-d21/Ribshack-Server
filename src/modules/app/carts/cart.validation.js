export const getAllCarts = (req, res, next) => {
  const userId = req.authUser?.id;
  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access profile" });
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
      .json({ success: false, message: "Invalid quantity specification" });
  }
  if (!price || isNaN(price) || Number(price) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid item price value" });
  }
  if (addOns !== undefined && !Array.isArray(addOns)) {
    return res.status(400).json({
      success: false,
      message: "addOns field parameter must be structured as an array",
    });
  }
  next();
};

export const updateCart = (req, res, next) => {
  const { quantity, price, addOns } = req.body;
  const { itemId } = req.params;

  if (!itemId || isNaN(itemId) || Number(itemId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid target cart item tracking ID",
    });
  }
  if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid replacement quantity amount" });
  }
  if (!price || isNaN(price) || Number(price) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid transactional price value" });
  }
  if (addOns !== undefined && !Array.isArray(addOns)) {
    return res.status(400).json({
      success: false,
      message: "addOns parameters must be structured as an array collection",
    });
  }
  next();
};

export const deleteCartItem = (req, res, next) => {
  const { itemId } = req.params;
  if (!itemId || isNaN(itemId) || Number(itemId) <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid deletion target item ID" });
  }
  next();
};

export const deleteAllCartItem = (req, res, next) => {
  const userId = req.authUser?.id;
  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized clear action attempt" });
  }
  next();
};
