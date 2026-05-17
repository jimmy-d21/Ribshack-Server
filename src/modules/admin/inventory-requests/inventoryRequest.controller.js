import { AdminInventoryRequestService as service } from "./inventoryRequest.service.js";

export const AdminInventoryRequestController = {
  getAllRequests: async (req, res) => {
    try {
      const { status } = req.query;

      const inventoryRequests = await service.getAllRequests(status);

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
        message:
          "Inventory request approved and store inventory updated successfully",
        data: updatedRequest,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  declineRequest: async (req, res) => {
    try {
      const { requestId } = req.params;
      const { remarks } = req.body;
      const adminId = req.authUser.id;

      const updatedRequest = await service.declineRequest(
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
