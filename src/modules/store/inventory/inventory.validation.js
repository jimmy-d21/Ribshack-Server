export const validateBranch = async (req, res, next) => {
  const branchId = req.authUser.id;
  if (!branchId) throw new Error("Branch ID not found");
  next();
};

export const addInventoryItem = (req, res, next) => {
  const {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  } = req.body;

  // Check for missing fields
  if (
    !itemName ||
    !itemType ||
    currentStock == null ||
    !minimumThreshold ||
    !maximumThreshold ||
    !unit
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // Only trim string fields
  if (!itemName.trim() || !itemType.trim() || !unit.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

  // Validate numeric fields
  if (
    isNaN(currentStock) ||
    isNaN(minimumThreshold) ||
    isNaN(maximumThreshold)
  ) {
    return res.status(400).json({
      success: false,
      message: "Stock and threshold fields must be valid numbers",
    });
  }

  next();
};

export const getInventoryDetails = (req, res, next) => {
  const { itemId } = req.params;

  if (isNaN(itemId) || Number(itemId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid inventory item ID",
    });
  }

  next();
};
