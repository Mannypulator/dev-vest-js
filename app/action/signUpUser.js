"use server";

import connectDB from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function signUpUser(formData) {
  await connectDB();

  // Check if user is already logged in
  const sessionUser = await getSessionUser();
  if (sessionUser && sessionUser.userId) {
    return { error: "You are already logged in" };
  }

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!firstName || !lastName || !email || !password) {
    return { error: "First name, last name, email, and password are required" };
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user (username set to firstName)
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username: firstName,
    });

    // Revalidate and redirect to login page
    revalidatePath("/", "layout");
    redirect("/");

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: "An error occurred during registration" };
  }
}

export default signUpUser;
