export const AdminInventoryRequestValidation = {
  approveRequest: (req, res, next) => {
    const { requestId } = req.params;
    const { remarks } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required",
      });
    }

    next();
  },

  declineRequest: (req, res, next) => {
    const { requestId } = req.params;
    const { remarks } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: "Remarks are required",
      });
    }

    next();
  },
};
