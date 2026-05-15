import bcrypt from "bcryptjs";
import { appAuthModel as model } from "./auth.model.js";

export const register = async (userData) => {
  const { fullName, email, password, contactNumber, confirmPassword } =
    userData;
  const existingEmail = await model.findByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await model.createAccount({
    fullName,
    email,
    password: hashedPassword,
    contactNumber,
  });

  delete newUser.password_hash;
  return newUser;
};
