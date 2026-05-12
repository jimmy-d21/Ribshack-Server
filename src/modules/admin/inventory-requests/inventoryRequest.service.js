import db from "../../../config/db.js";
import AdminInventoryRequestModel from "./inventoryRequest.model.js";

const AdminInventoryRequestService = {
  getAllInventoryRequests: async (status = null) => {
    const inventoryRequests = await AdminInventoryRequestModel.findAll(status);
    return inventoryRequests;
  },

  approveRequest: async (requestId, remarks, adminId) => {
    const status = "APPROVED";
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const request = await AdminInventoryRequestModel.findById(
        client,
        requestId,
      );
      if (!request) {
        throw new Error("Inventory request not found");
      }

      await AdminInventoryRequestModel.createStatusLogs(
        client,
        requestId,
        status,
        adminId,
        remarks,
      );

      const result = await AdminInventoryRequestModel.updateStatus(
        client,
        requestId,
        status,
      );

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};

export default AdminInventoryRequestService;
