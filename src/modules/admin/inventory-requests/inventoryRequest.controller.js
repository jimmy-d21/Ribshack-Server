import AdminInventoryRequestService from "./inventoryRequest.service.js";

const AdminInventoryRequestController = {
  getAllInventoryRequests: async (req, res) => {
    try {
      const { status } = req.query;

      const inventoryRequests =
        await AdminInventoryRequestService.getAllInventoryRequests(status);

      res.status(200).json({
        success: true,
        inventoryRequests,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default AdminInventoryRequestController;
