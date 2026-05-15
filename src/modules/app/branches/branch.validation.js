export const validateBranchId = (req, res, next) => {
  const { branchId } = req.params;

  if (!branchId || isNaN(branchId) || Number(branchId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid Branch ID. It must be a positive number.",
    });
  }

  next();
};
