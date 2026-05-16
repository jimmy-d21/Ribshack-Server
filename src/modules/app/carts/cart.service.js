import { appCartModel as model } from "./cart.model.js";

export const getAllCarts = async (userId) => {
  const user = await model.findUserById(userId);
  if (!user) throw new Error("User not found");

  const carts = await model.findAll(userId);
  return carts;
};
