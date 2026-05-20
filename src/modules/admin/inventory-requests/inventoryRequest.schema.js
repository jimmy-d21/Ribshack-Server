import { z } from "zod";

export const requestActionSchema = z.object({
  remarks: z
    .string({ required_error: "Remarks are required" })
    .min(1, "Remarks cannot be empty"),
});
