"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function signInWithCredentials(email, password) {
  await connectDB();

  // Validate email
  if (!email || typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  // Validate password
  if (!password || typeof password !== "string") {
    throw new Error("Password is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.password) {
    throw new Error("No password set for this account");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };
}