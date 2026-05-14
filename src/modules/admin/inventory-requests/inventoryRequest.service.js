import db from "../../../config/db.js";
import { adminInventoryRequestModel as model } from "./inventoryRequest.model.js";

export const AdminInventoryRequestService = {
  getAllRequests: async (status = null) => {
    const inventoryRequests = await model.findAll(status);
    return inventoryRequests;
  },

  updateRequestStatus: async (requestId, remarks, adminId, status) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const request = await model.findById(client, requestId);

      if (!request) {
        throw new Error("Inventory request not found");
      }

      if (request.status === "APPROVED" || request.status === "DECLINED") {
        throw new Error(
          `This request cannot be updated because it has already been ${request.status.toLowerCase()}.`,
        );
      }

      await model.createStatusLogs(client, requestId, status, adminId, remarks);

      const result = await model.updateStatus(client, requestId, status);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  approveRequest: async (requestId, remarks, adminId) => {
    return AdminInventoryRequestService.updateRequestStatus(
      requestId,
      remarks,
      adminId,
      "APPROVED",
    );
  },

  declineRequest: async (requestId, remarks, adminId) => {
    return AdminInventoryRequestService.updateRequestStatus(
      requestId,
      remarks,
      adminId,
      "DECLINED",
    );
  },
};
