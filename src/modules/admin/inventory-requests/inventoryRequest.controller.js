import AdminInventoryRequestService from "./inventoryRequest.service.js";

const AdminInventoryRequestController = {
  getAllInventoryRequests: async (req, res) => {
    try {
      const { status } = req.query;

      const inventoryRequests =
        await AdminInventoryRequestService.getAllInventoryRequests(status);

      return res.status(200).json({
        success: true,
        inventoryRequests,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  approveRequest: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { remarks } = req.body;
      const adminId = req.authUser.id;

      const updatedRequest = await AdminInventoryRequestService.approveRequest(
        requestId,
        remarks,
        adminId,
      );

      return res.status(200).json({
        success: true,
        message: "Inventory request approved successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  declinedRequest: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { remarks } = req.body;
      const adminId = req.authUser.id;

      const updatedRequest = await AdminInventoryRequestService.declinedRequest(
        requestId,
        remarks,
        adminId,
      );

      return res.status(200).json({
        success: true,
        message: "Inventory request declined successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default AdminInventoryRequestController;
