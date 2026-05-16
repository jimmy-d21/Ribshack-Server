export const getAllCarts = (req, res, next) => {
  const userId = req.authUser.id;

  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};
