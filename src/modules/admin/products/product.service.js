import cloudinary from "../../../config/cloudinary.js";
import db from "../../../config/db.js";
import AppError from "../../../utils/AppError.js";
import { adminBranchesModel as branchModel } from "../branches/branches.model.js";
import { adminProductModel as model } from "./product.model.js";

// Parses the Cloudinary public ID from a full image URL
const extractCloudinaryPublicId = (imageUrl) =>
  imageUrl.split("/").pop().split(".")[0];

// Syncs product availability and menu visibility across all branches
const syncProductToBranches = async (client, productId, available) => {
  const branches = await branchModel.findAll();
  for (const branch of branches) {
    const branchId = branch.branch_id || branch.id;
    await model.upsertBranchAvailability(
      client,
      branchId,
      productId,
      available,
    );
    await model.upsertBranchMenu(client, branchId, productId, available);
  }
};

export const getAllProducts = async () => {
  return model.findAll();
};

export const createProduct = async (productData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const {
      name,
      price,
      description,
      unliRice,
      available,
      image,
      addOns,
      category,
    } = productData;

    let categoryRow = await model.findCategoryByName(client, category);
    if (!categoryRow)
      categoryRow = await model.createCategory(client, category);

    const newProduct = await model.create(client, {
      name,
      price,
      description,
      categoryId: categoryRow.category_id,
      unliRice,
      available: available !== undefined ? available : true,
    });

    const productId = newProduct.product_id;

    // Register the product in all existing branches on creation
    const branches = await branchModel.findAll();
    for (const branch of branches) {
      const branchId = branch.id;
      await model.createBranchProduct(client, branchId, productId);
    }

    await syncProductToBranches(client, productId, available);

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "ribshack_products",
      });
      await model.createImage(client, productId, uploaded.secure_url);
    }

    if (Array.isArray(addOns)) {
      for (const addon of addOns) {
        await model.createAddOns(
          client,
          productId,
          addon.name,
          addon.type,
          addon.price,
        );
      }
    }

    const fullProduct = await model.findById(client, productId);
    await client.query("COMMIT");
    return fullProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getProductDetails = async (productId) => {
  const product = await model.findById(db, productId);
  if (!product) throw new AppError("Product not found", 404);
  return product;
};

export const updateProduct = async (productId, productData) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const existing = await model.findById(client, productId);
    if (!existing) throw new AppError("Product not found", 404);

    const {
      name,
      category,
      price,
      description,
      unliRice,
      available,
      image,
      addOns,
    } = productData;

    let categoryId = existing.category_id;
    if (category && category !== existing.category) {
      let categoryRow = await model.findCategoryByName(client, category);
      if (!categoryRow)
        categoryRow = await model.createCategory(client, category);
      categoryId = categoryRow.category_id;
    }

    const updatedAvailability =
      available !== undefined ? available : existing.available;

    await model.update(client, productId, {
      name: name || existing.name,
      price: price || existing.price,
      description: description || existing.description,
      categoryId,
      unliRice: unliRice !== undefined ? unliRice : existing.unliRice,
      available: updatedAvailability,
    });

    await syncProductToBranches(client, productId, updatedAvailability);

    if (image && image !== existing.image) {
      if (existing.image) {
        const oldPublicId = extractCloudinaryPublicId(existing.image);
        await cloudinary.uploader.destroy(oldPublicId);
      }
      const uploaded = await cloudinary.uploader.upload(image);
      await model.updateImage(client, productId, uploaded.secure_url);
    }

    // Replace all add-ons with the incoming set
    await model.deleteAllAddOns(client, productId);
    if (Array.isArray(addOns)) {
      for (const addon of addOns) {
        await model.createAddOns(
          client,
          productId,
          addon.name,
          addon.type,
          addon.price,
        );
      }
    }

    const finalProduct = await model.findById(client, productId);
    await client.query("COMMIT");
    return finalProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteProduct = async (productId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const product = await model.findById(client, productId);
    if (!product) throw new AppError("Product not found", 404);

    if (product.image) {
      const publicId = extractCloudinaryPublicId(product.image);
      await cloudinary.uploader.destroy(publicId);
    }

    await model.delete(client, productId);
    await client.query("COMMIT");
    return product;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateAvailability = async (productId) => {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const product = await model.findById(client, productId);
    if (!product) throw new AppError("Product not found", 404);

    const newAvailability = !product.available;
    await model.updateAvailability(client, productId, newAvailability);
    await syncProductToBranches(client, productId, newAvailability);

    const updatedProduct = await model.findById(client, productId);
    await client.query("COMMIT");
    return updatedProduct;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
