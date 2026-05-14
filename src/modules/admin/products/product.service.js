import cloudinary from "../../../config/cloudinary.js";
import db from "../../../config/db.js";
import { adminBranchesModel as branchModel } from "../branches/branches.model.js";
import { adminProductModel as model } from "./product.model.js";

export const AdminProductServices = {
  getAllProducts: async () => {
    return await model.findAll();
  },

  createProduct: async (productData) => {
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
      if (!categoryRow) {
        categoryRow = await model.createCategory(client, category);
      }

      const newProduct = await model.create(client, {
        name,
        price,
        description,
        categoryId: categoryRow.category_id,
        unliRice,
        available: available !== undefined ? available : true,
      });

      const productId = newProduct.product_id;

      const branches = await branchModel.findAll();
      for (const branch of branches) {
        const bId = branch.branch_id || branch.id;

        await model.createBranchProduct(client, bId, productId);

        await model.upsertBranchAvailability(client, bId, productId, available);
        await model.upsertBranchMenu(client, bId, productId, available);
      }

      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image, {
          folder: "ribshack_products",
        });
        await model.createImage(client, productId, uploadedImage.secure_url);
      }

      if (addOns && Array.isArray(addOns)) {
        for (const addon of addOns) {
          await model.createAddOns(client, productId, addon.name, addon.price);
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
  },

  getProductDetails: async (productId) => {
    const product = await model.findById(undefined, productId);
    if (!product) throw new Error("Product not found");
    return product;
  },

  updateProduct: async (productId, productData) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      const existingProduct = await model.findById(client, productId);
      if (!existingProduct) throw new Error("Product not found");

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

      let categoryId = existingProduct.category_id;
      if (category && category !== existingProduct.category) {
        let catRow = await model.findCategoryByName(client, category);
        if (!catRow) catRow = await model.createCategory(client, category);
        categoryId = catRow.category_id;
      }

      const updatedStatus =
        available !== undefined ? available : existingProduct.available;
      await model.update(client, productId, {
        name: name || existingProduct.name,
        price: price || existingProduct.price,
        description: description || existingProduct.description,
        categoryId,
        unliRice: unliRice !== undefined ? unliRice : existingProduct.unliRice,
        available: updatedStatus,
      });

      const branches = await branchModel.findAll();
      for (const branch of branches) {
        const bId = branch.branch_id || branch.id;
        await model.upsertBranchAvailability(
          client,
          bId,
          productId,
          updatedStatus,
        );
        await model.upsertBranchMenu(client, bId, productId, updatedStatus);
      }

      if (image && image !== existingProduct.image) {
        // Delete old image from Cloudinary if it exists
        if (existingProduct.image) {
          const oldPublicId = existingProduct.image
            .split("/")
            .pop()
            .split(".")[0];
          await cloudinary.uploader.destroy(oldPublicId);
        }
        const uploadResponse = await cloudinary.uploader.upload(image);
        await model.updateImage(client, productId, uploadResponse.secure_url);
      }

      await model.deleteAllAddOns(client, productId);
      if (addOns && Array.isArray(addOns)) {
        for (const addon of addOns) {
          await model.createAddOns(client, productId, addon.name, addon.price);
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
  },

  deleteProduct: async (productId) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const product = await model.findById(client, productId);
      if (!product) throw new Error("Product not found");

      if (product.image) {
        const publicId = product.image.split("/").pop().split(".")[0];
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
  },

  updateAvailability: async (productId) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const product = await model.findById(client, productId);
      if (!product) throw new Error("Product not found");

      const newStatus = !product.available;
      await model.updateAvailability(client, productId, newStatus);

      const branches = await branchModel.findAll();
      for (const branch of branches) {
        const bId = branch.branch_id || branch.id;
        await model.upsertBranchAvailability(client, bId, productId, newStatus);
        await model.upsertBranchMenu(client, bId, productId, newStatus);
      }

      const updatedProduct = await model.findById(client, productId);
      await client.query("COMMIT");
      return updatedProduct;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
