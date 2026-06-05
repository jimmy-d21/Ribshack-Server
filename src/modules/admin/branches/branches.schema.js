import { z } from "zod";

export const createBranchSchema = z.object({
  branch_name: z
    .string({ required_error: "Branch name is required" })
    .min(1, "Branch name cannot be empty"),
  full_address: z
    .string({ required_error: "Address is required" })
    .min(1, "Address cannot be empty"),
  city: z
    .string({ required_error: "City is required" })
    .min(1, "City cannot be empty"),
  region: z
    .string({ required_error: "Region is required" })
    .min(1, "Region cannot be empty"),
  manager_name: z
    .string({ required_error: "Manager name is required" })
    .min(1, "Manager name cannot be empty"),
  contact_number: z
    .string({ required_error: "Contact number is required" })
    .min(1, "Contact number cannot be empty"),
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username cannot be empty"),
  confirmPassword: z
    .string({ required_error: "Confirm password is required" })
    .min(8, "Password must be at least 8 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const updateBranchSchema = z.object({
  branch_name: z.string().min(1, "Branch name cannot be empty"),
  full_address: z.string().min(1, "Address cannot be empty"),
  city: z.string().min(1, "City cannot be empty"),
  region: z.string().min(1, "Region cannot be empty"),
  manager_name: z.string().min(1, "Manager name cannot be empty"),
  contact_number: z.string().min(1, "Contact number cannot be empty"),
  username: z.string().min(1, "Username cannot be empty"),
  status: z.boolean(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  newPassword: z
    .string()
    .min(8, "New Password must be at least 8 characters")
    .optional(),
  confirmPassword: z.string().optional(),
});
