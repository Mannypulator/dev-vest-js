import { auth } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/config/database";
import User from "@/models/User";

export const getSessionUser = async () => {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    // Find the User document by email
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.error("No User document found for session user:", {
        email: session.user.email,
        id: session.user.id,
      });
      return null;
    }

    return {
      userId: user._id.toString(),
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.username || session.user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image || session.user.image,
        bookmarks: user.bookmarks,
      },
    };
  } catch (error) {
    console.error("getSessionUser error:", error);
    return null;
  }
};
