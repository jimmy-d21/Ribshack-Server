import { z } from "zod";

export const inventoryItemSchema = z
  .object({
    itemName: z
      .string({ required_error: "Item name is required" })
      .min(1, "Item name cannot be empty"),
    itemType: z
      .string({ required_error: "Item type is required" })
      .min(1, "Item type cannot be empty"),
    currentStock: z
      .number({ required_error: "Current stock is required" })
      .min(0, "Current stock cannot be negative"),
    minimumThreshold: z
      .number({ required_error: "Minimum threshold is required" })
      .positive("Minimum threshold must be greater than zero"),
    maximumThreshold: z
      .number({ required_error: "Maximum threshold is required" })
      .positive("Maximum threshold must be greater than zero"),
    unit: z
      .string({ required_error: "Unit is required" })
      .min(1, "Unit cannot be empty"),
  })
  .refine((data) => data.maximumThreshold > data.minimumThreshold, {
    message: "Maximum threshold must be greater than minimum threshold",
    path: ["maximumThreshold"],
  });

const URGENCY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export const inventoryRequestSchema = z.object({
  quantity: z
    .number({ required_error: "Quantity is required" })
    .positive("Quantity must be a valid positive number"),
  urgency: z.enum(URGENCY_LEVELS, {
    errorMap: () => ({
      message: `Urgency must be one of: ${URGENCY_LEVELS.join(", ")}`,
    }),
  }),
  notes: z
    .string({ required_error: "Notes are required" })
    .min(1, "Notes cannot be empty"),
});
