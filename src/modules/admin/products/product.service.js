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

      let imageUrl = null;

      if (image) {
        const uploadedImage = await cloudinary.uploader.upload(image);

        imageUrl = uploadedImage.secure_url;

        await model.createImage(client, newProduct.product_id, imageUrl);
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
};
