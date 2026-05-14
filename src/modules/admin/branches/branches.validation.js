export const AdminBranchesValidation = {
  createBranch: (req, res, next) => {
    const {
      branch_name,
      full_address,
      city,
      region,
      manager_name,
      contact_number,
      username,
      password,
    } = req.body;

    if (
      !branch_name ||
      !full_address ||
      !city ||
      !region ||
      !manager_name ||
      !contact_number ||
      !username ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields including credentials",
      });
    }

    if (
      !branch_name.trim() ||
      !full_address.trim() ||
      !city.trim() ||
      !region.trim() ||
      !manager_name.trim() ||
      !contact_number.trim() ||
      !username.trim() ||
      !password.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty or whitespace",
      });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    next();
  },

  updateBranch: (req, res, next) => {
    const { branchId } = req.params;
    const {
      branch_name,
      full_address,
      city,
      region,
      manager_name,
      contact_number,
      username,
      password,
    } = req.body;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch ID is required",
      });
    }

    if (
      !branch_name ||
      !full_address ||
      !city ||
      !region ||
      !manager_name ||
      !contact_number ||
      !username
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (
      !branch_name.trim() ||
      !full_address.trim() ||
      !city.trim() ||
      !region.trim() ||
      !manager_name.trim() ||
      !contact_number.trim() ||
      !username.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty or whitespace",
      });
    }

    if (password && password.trim().length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    next();
  },

  getBranchDetails: (req, res, next) => {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch ID is required",
      });
    }

    next();
  },

  deleteBranch: (req, res, next) => {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch ID is required",
      });
    }

    next();
  },

  updateBranchStatus: (req, res, next) => {
    const { branchId, status } = req.params;

    if (!branchId || !status) {
      return res.status(400).json({
        success: false,
        message: "Branch ID and status are required",
      });
    }

    const allowedStatuses = ["open", "closed"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'open' or 'closed'",
      });
    }

    next();
  },
};
