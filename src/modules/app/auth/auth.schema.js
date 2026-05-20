import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(1, "Full name cannot be empty"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address"),
    contactNumber: z
      .string({ required_error: "Contact number is required" })
      .min(1, "Contact number cannot be empty"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({
      required_error: "Please confirm your password",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password cannot be empty"),
});
