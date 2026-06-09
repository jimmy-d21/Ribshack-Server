import AppError from "../../../utils/AppError.js";
import { appNotificationModel as model } from "./notification.model.js";

export const getAllNotifications = async (userId) => {
  const notifications = await model.findAll(userId);

  return notifications.map((n) => ({
    ...n,
    actionUrl: "/order",
  }));
};

export const updateNotification = async (notificationId) => {
  let updatedNotification = await model.findByIdAndUpdate(notificationId);

  if (!updatedNotification) {
    throw new AppError("Notification not found", 404);
  }

  updatedNotification.actionUrl = "/order";

  return updatedNotification;
};

export const markAllAsRead = async (userId) => {
  await model.markAllAsRead(userId);
};

export const deleteNotification = async (notificationId) => {
  const notification = await model.findById(notificationId);
  if (!notification) throw new AppError("Notification not found", 404);

  await model.findByIdAndDelete(notificationId);
};

export const deleteAllNotification = async (userId) => {
  await model.deleteAll(userId);
};
