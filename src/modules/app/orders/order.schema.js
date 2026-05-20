import { z } from "zod";

const PAYMENT_METHODS = ["CASH_ON_DELIVERY", "GCASH", "CREDIT_CARD"];

export const createOrderSchema = z.object({
  branchId: z
    .number({ required_error: "Branch ID is required" })
    .positive("Invalid branch ID"),
  paymentMethod: z.enum(PAYMENT_METHODS, {
    errorMap: () => ({
      message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`,
    }),
  }),
  instructions: z.string().optional(),
});
