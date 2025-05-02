import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export async function POST(request) {
  try {
    await connectDB();

    // Parse FormData
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password (if user signed up with credentials)
    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      // User likely signed up via Google/Facebook
      return NextResponse.json(
        { error: "Please use your social login provider to sign in" },
        { status: 401 }
      );
    }

    // Check for existing session (optional)
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      return NextResponse.json(
        { message: "User is already logged in" },
        { status: 200 }
      );
    }

    // Return success response with user data
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
