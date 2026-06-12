import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { adminInventoryRequestModel as model } from "./inventoryRequest.model.js";

export const getAllRequests = async (status = null) => {
  return model.findAll(status);
};

const updateRequestStatus = async (requestId, remarks, adminId, status) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const request = await model.findById(requestId, client);
    if (!request) throw new AppError("Inventory request not found", 404);

    if (request.status === "APPROVED" || request.status === "DECLINED") {
      throw new AppError(
        `This request cannot be updated because it has already been ${request.status.toLowerCase()}.`,
        409,
      );
    }

    let newNotifications = null;
    if (status === "APPROVED" && request.items?.length > 0) {
      for (const lineItem of request.items) {
        if (!lineItem.itemId || !lineItem.quantity) continue;

        await model.incrementItemQuantity(
          client,
          lineItem.itemId,
          lineItem.quantity,
        );
      }

      newNotifications = await model.createNotification(
        client,
        request.branch_id,
        "Restock Request Approved",
        `Your restock request for ${request.inventoryName} has been approved. ${remarks ?? "Delivery scheduled for tomorrow."}`,
        "ACCEPT_REQUEST",
      );
    }

    if (status === "DECLINED") {
      newNotifications = await model.createNotification(
        client,
        request.branch_id,
        "Restock Request Declined",
        `Your restock request for ${request.inventoryName} has been declined. Reason: ${remarks}`,
        "DECLINED_REQUEST",
      );
    }

    await model.createStatusLogs(client, requestId, status, adminId, remarks);
    const result = await model.updateStatus(client, requestId, status);

    const updatedRequest = await model.findById(requestId, client);

    newNotifications.actionUrl = "/inventory";

    await client.query("COMMIT");
    return { updatedRequest, newNotifications };
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
