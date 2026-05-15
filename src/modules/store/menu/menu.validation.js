export const getMenuDetails = (req, res, next) => {
  const { productId } = req.params;

  if (isNaN(productId) || Number(productId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  next();
};
