import cloudinary from "../../../config/cloudinary.js";
import db from "../../../config/db.js";
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
        available,
      });

      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image);

        await model.createImage(
          client,
          newProduct.product_id,
          uploadedImage.secure_url,
        );
      }

      if (addOns && Array.isArray(addOns)) {
        for (const addon of addOns) {
          await model.createAddOns(
            client,
            newProduct.product_id,
            addon.name,
            addon.price,
          );
        }
      }

      const fullProduct = await model.findById(client, newProduct.product_id);

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

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  },

  updateProduct: async (productId, productData) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

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

      // Check existence
      const existingProduct = await model.findById(client, productId);
      if (!existingProduct) throw new Error("Product not found");

      // Handle Category (Find or Create
      let categoryId = existingProduct.category_id;
      if (category !== existingProduct.category) {
        let catRow = await model.findCategoryByName(client, category);
        if (!catRow) {
          catRow = await model.createCategory(client, category);
        }
        categoryId = catRow.category_id;
      }

      // Update Base Product Info
      const updatedProduct = await model.update(client, productId, {
        name,
        price,
        description,
        categoryId,
        unliRice,
        available,
      });

      // Handle Image Change
      if (image && image !== existingProduct.image) {
        // If the image is a new upload it
        const uploadResponse = await cloudinary.uploader.upload(image);
        await model.updateImage(client, productId, uploadResponse.secure_url);
      }

      // Sync Add-ons (Delete all old ones and re-insert new ones)
      // This is the simplest way to "update" a list of items
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
};
