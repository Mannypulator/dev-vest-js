import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

export async function GET() {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const count = await Property.countDocuments({ owner: sessionUser.userId });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error fetching user properties count:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch properties count" },
      { status: 500 }
    );
  }
}
