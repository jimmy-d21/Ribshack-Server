import { z } from "zod";

export const addAddressSchema = z.object({
  fullAddress: z
    .string({ required_error: "Full address is required" })
    .min(1, "Full address cannot be empty"),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City cannot be empty"),
  label: z.string().min(1, "Address label cannot be empty").optional(),
  province: z.string().min(1, "Province cannot be empty").optional(),
  postalCode: z.string().min(1, "Postal code cannot be empty").optional(),
  landMark: z.string().optional(),
  isDefault: z.boolean().optional(),
});
