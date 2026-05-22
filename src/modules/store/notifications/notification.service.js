import { storeNotificationModel as model } from "./notification.model.js";

const ACTION_URL_MAP = {
  NEW_ORDER: "/kitchen",
  INV_LOW: "/inventory",
  INV_REQUEST: "/inventory",
  ACCEPT_REQUEST: "/inventory",
  DECLINED_REQUEST: "/inventory",
  SYSTEM_ALERT: "/",
  STAFF_CHECK: "/staff",
};

export const getAllNotifications = async (branchId) => {
  const notifications = await model.findAll(branchId);

  return notifications.map((n) => ({
    ...n,
    actionUrl: ACTION_URL_MAP[n.type] ?? "/",
  }));
};
