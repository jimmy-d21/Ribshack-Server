import db from "../../../config/db.js";
import { adminInventoryRequestModel as model } from "./inventoryRequest.model.js"; // Standardized import target

export const AdminInventoryRequestService = {
  getAllRequests: async (status = null) => {
    return await model.findAll(status);
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

      // Safe stock rebalancing conditional checks
      if (status === "APPROVED" && request.items && request.items.length > 0) {
        for (const lineItem of request.items) {
          if (!lineItem.item_id || !lineItem.quantity) continue;

          await model.incrementItemQuantity(
            client,
            lineItem.item_id,
            lineItem.quantity,
          );
        }
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
