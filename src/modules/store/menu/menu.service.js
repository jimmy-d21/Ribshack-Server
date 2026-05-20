import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { storeMenuModel as model } from "./menu.model.js";

const validateBranch = async (branchId) => {
  const branch = await model.findBranchById(branchId);
  if (!branch) throw new AppError("Branch not found", 404);
  return branch;
};

export const getAllMenu = async (branchId) => {
  await validateBranch(branchId);
  return model.findAll(branchId);
};

export const getMenuDetails = async (productId) => {
  const product = await model.findById(productId);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const updateMenuStatus = async (productId, branchId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await validateBranch(branchId);

    const product = await model.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    if (branchId.toString() !== product.branchId.toString()) {
      throw new AppError("You are not authorized to update this product", 403);
    }

    const newStatus = !product.availability.isAvailable;

    await model.updateStatus(client, productId, newStatus);

    await model.createProductAvailability(
      client,
      branchId,
      product.productCode,
      newStatus,
    );

    await client.query("COMMIT");

    const finalMenu = await model.findById(productId);
    return finalMenu;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
