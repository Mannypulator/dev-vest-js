"use server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function signUpUser(formData) {
  await connectDB();

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
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      username: firstName,
    });

    revalidatePath("/");
    redirect("/");

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: error.message || "An error occurred during registration" };
  }
}

export default signUpUser;
