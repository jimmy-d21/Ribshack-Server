import bcrypt from "bcryptjs";
import { appAuthModel as model } from "./auth.model.js";

export const register = async (userData) => {
  const { fullName, email, password, contactNumber } = userData;

  const existingEmail = await model.findByEmail(email);
  if (existingEmail) throw new Error("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return model.createAccount({
    fullName,
    email,
    password: hashedPassword,
    contactNumber,
  });
};

export const login = async (userData) => {
  const { email, password } = userData;

  const user = await model.findByEmailWithPassword(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  delete user.password;
  return user;
};

export const me = async (userId) => {
  const user = await model.findById(userId);
  if (!user) throw new Error("User not found");
  return user;
};
