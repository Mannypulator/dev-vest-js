"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function signInWithCredentials(formData) {
  await connectDB();

  // Check if user is already logged in
  const sessionUser = await getSessionUser();
  if (sessionUser && sessionUser.userId) {
    return { error: "You are already logged in" };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid email or password" };
    }

    // Check if password exists (since it's optional in schema)
    if (!user.password) {
      return { error: "No password set for this account" };
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "Invalid email or password" };
    }

    // Revalidate and redirect
    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    console.error("Sign-in error:", error);
    return { error: "An error occurred during sign-in" };
  }
}

export default signInWithCredentials;
