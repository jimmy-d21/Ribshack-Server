import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { adminInventoryRequestModel as model } from "./inventoryRequest.model.js";

export const getAllRequests = async (status = null) => {
  return model.findAll(status);
};

// Shared logic for approving or declining a request
const updateRequestStatus = async (requestId, remarks, adminId, status) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const request = await model.findById(client, requestId);
    if (!request) throw new AppError("Inventory request not found", 404);

    if (request.status === "APPROVED" || request.status === "DECLINED") {
      throw new AppError(
        `This request cannot be updated because it has already been ${request.status.toLowerCase()}.`,
        409,
      );
    }

    // Increment stock quantities when the request is approved
    if (status === "APPROVED" && request.items?.length > 0) {
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
};

export const approveRequest = (requestId, remarks, adminId) =>
  updateRequestStatus(requestId, remarks, adminId, "APPROVED");

export const declineRequest = (requestId, remarks, adminId) =>
  updateRequestStatus(requestId, remarks, adminId, "DECLINED");
