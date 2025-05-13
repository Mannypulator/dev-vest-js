"use server";
import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  try {
    await connectDB();

    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error("Property not found");
    }

    if (property.owner.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    // Extract Cloudinary public IDs
    const publicIds = property.images
      .filter((imageUrl) => typeof imageUrl === "string" && imageUrl.includes("cloudinary"))
      .map((imageUrl) => {
        const parts = imageUrl.split("/");
        const fileName = parts.at(-1);
        if (!fileName) return null;
        return `propertypulse/${fileName.split(".").at(0)}`;
      })
      .filter((id) => id);

    // Delete images from Cloudinary
    if (publicIds.length > 0) {
      await Promise.all(
        publicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId).catch((err) => {
            console.error(`Failed to delete Cloudinary image ${publicId}:`, err);
          })
        )
      );
    }

    // Delete property from MongoDB
    await property.deleteOne();

    // Revalidate profile page
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("Delete property error:", error);
    throw new Error(error.message || "Failed to delete property");
  }
}

export default deleteProperty;