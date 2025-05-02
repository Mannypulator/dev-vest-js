import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 401 }
      );
    }

    const user = await User.findById(sessionUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isBookmarked = user.bookmarks.includes(propertyId);

    return NextResponse.json({ success: true, isBookmarked });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check bookmark status" },
      { status: 500 }
    );
  }
}
