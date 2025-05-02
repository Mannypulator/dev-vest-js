import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export async function POST(request) {
  try {
    await connectDB();

    const { propertyId } = await request.json();

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
    let message;

    if (isBookmarked) {
      user.bookmarks.pull(propertyId);
      message = "Bookmark removed successfully";
    } else {
      user.bookmarks.push(propertyId);
      message = "Bookmark added successfully";
    }

    await user.save();

    return NextResponse.json({
      success: true,
      isBookmarked: !isBookmarked,
      message,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
