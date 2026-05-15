export const addInventoryItem = (req, res, next) => {
  const {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  } = req.body;

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

  if (!itemName.trim() || !itemType.trim() || !unit.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

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

  // added — was missing in addInventoryItem but present in updateInventory
  if (Number(minimumThreshold) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid minimum threshold",
    });
  }

  if (Number(maximumThreshold) <= Number(minimumThreshold)) {
    return res.status(400).json({
      success: false,
      message: "Maximum threshold must be greater than minimum threshold",
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

export const updateInventory = (req, res, next) => {
  const { itemId } = req.params;
  const {
    itemName,
    itemType,
    currentStock,
    minimumThreshold,
    maximumThreshold,
    unit,
  } = req.body;

  if (isNaN(itemId) || Number(itemId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid inventory item ID",
    });
  }

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

  if (!itemName.trim() || !itemType.trim() || !unit.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

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

  if (Number(minimumThreshold) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid minimum threshold",
    });
  }

  if (Number(maximumThreshold) <= Number(minimumThreshold)) {
    return res.status(400).json({
      success: false,
      message: "Maximum threshold must be greater than minimum threshold",
    });
  }

  next();
};

export const deleteInventory = (req, res, next) => {
  const { itemId } = req.params;

  if (isNaN(itemId) || Number(itemId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid inventory item ID",
    });
  }

  next();
};

export const inventoryRequest = (req, res, next) => {
  const { itemId } = req.params;
  const { quantity, urgency, notes } = req.body;

  if (isNaN(itemId) || Number(itemId) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid inventory item ID",
    });
  }

  if (!quantity || !urgency || !notes) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (!urgency.trim() || !notes.trim()) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty or whitespace",
    });
  }

  if (isNaN(quantity) || Number(quantity) <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a valid positive number",
    });
  }

  const validUrgencyLevels = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  if (!validUrgencyLevels.includes(urgency.toUpperCase())) {
    return res.status(400).json({
      success: false,
      message: "Urgency must be one of: LOW, MEDIUM, HIGH, CRITICAL",
    });
  }

  next();
};
