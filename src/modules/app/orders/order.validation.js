export const getAllOrders = (req, res, next) => {
  const userId = req.authUser?.id;

  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};

export const getOrderDetails = (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId || isNaN(orderId) || Number(orderId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  next();
};

export const createOrder = (req, res, next) => {
  const { paymentMethod, branchId, instructions } = req.body;

  if (!branchId || isNaN(branchId) || Number(branchId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid branch ID",
    });
  }

  const allowedPaymentMethods = ["CASH_ON_DELIVERY", "GCASH", "CREDIT_CARD"];
  if (!paymentMethod || !allowedPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: `Payment method must be one of: ${allowedPaymentMethods.join(", ")}`,
    });
  }

  if (instructions !== undefined && typeof instructions !== "string") {
    return res.status(400).json({
      success: false,
      message: "Instructions must be a text",
    });
  }

  next();
};

export const deleteOrder = (req, res, next) => {
  const { orderId } = req.params;

  if (!orderId || isNaN(orderId) || Number(orderId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  next();
};
