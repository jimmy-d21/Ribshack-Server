export const validateBranch = async (req, res, next) => {
  const branchId = req.authUser.id;
  if (!branchId) throw new Error("Branch ID not found");
  next();
};
