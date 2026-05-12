import AdminInventoryRequestModel from "./inventoryRequest.model.js";

const AdminInventoryRequestService = {
  getAllInventoryRequests: async (status = null) => {
    const inventoryRequests = await AdminInventoryRequestModel.findAll(status);
    return inventoryRequests;
  },
};

export default AdminInventoryRequestService;
