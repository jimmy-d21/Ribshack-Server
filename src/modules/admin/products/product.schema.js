import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name cannot be empty"),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category cannot be empty"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be greater than zero"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),
  unliRice: z.boolean({ required_error: "unliRice flag is required" }),
  available: z.boolean({ required_error: "Available flag is required" }),
  image: z
    .string({ required_error: "Image is required" })
    .min(1, "Image cannot be empty"),
  addOns: z
    .array(
      z.object({
        name: z.string().min(1, "Add-on name cannot be empty"),
        type: z.string().min(1, "Add-on type cannot be empty"),
        price: z.number().positive("Add-on price must be greater than zero"),
      }),
    )
    .optional(),
});
