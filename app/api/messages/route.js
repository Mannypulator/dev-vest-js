import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import { getSessionUser } from "@/utils/getSessionUser";

export async function POST(request) {
  try {
    await connectDB();

    const { property, recipient, name, email, phone, message } =
      await request.json();

    if (!property || !recipient || !name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { success: false, message: "User must be logged in" },
        { status: 401 }
      );
    }

    console.log("Sending message:", {
      property,
      recipient,
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}
