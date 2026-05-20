import { z } from "zod";

const addOnSchema = z.object({
  id: z
    .number({ required_error: "Add-on ID is required" })
    .positive("Add-on ID must be positive"),
  name: z.string().min(1, "Add-on name cannot be empty"),
  price: z.number().positive("Add-on price must be greater than zero"),
});

export const addToCartSchema = z.object({
  branchId: z
    .number({ required_error: "Branch ID is required" })
    .positive("Invalid branch ID"),
  productId: z
    .number({ required_error: "Product ID is required" })
    .positive("Invalid product ID"),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .positive("Invalid quantity"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Invalid price"),
  addOns: z.array(addOnSchema).optional(),
});

export const updateCartSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .positive("Invalid quantity"),
  price: z
    .number({ required_error: "Price is required" })
    .positive("Invalid price"),
  addOns: z.array(addOnSchema).optional(),
});
