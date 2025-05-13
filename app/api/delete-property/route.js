import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

export async function POST(request) {
  try {
    await connectDB();

    // Verify user session
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Parse request body
    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Find property
    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (property.owner.toString() !== sessionUser.userId) {
      return NextResponse.json(
        { error: "Unauthorized: You are not the owner" },
        { status: 403 }
      );
    }

    // Prepare Cloudinary deletions
    const assetsToDelete = [];

    // Add images
    if (property.images && property.images.length > 0) {
      property.images.forEach((imageUrl) => {
        const urlParts = imageUrl.split("/");
        const fileName = urlParts.pop().split(".")[0];
        const folderPath = urlParts
          .slice(urlParts.indexOf("upload") + 1)
          .join("/");
        const publicId = folderPath ? `${folderPath}/${fileName}` : fileName;
        assetsToDelete.push({
          publicId,
          resource_type: "image",
        });
      });
    }

    // Add video
    if (property.videoUrl) {
      const urlParts = property.videoUrl.split("/");
      const fileName = urlParts.pop().split(".")[0];
      const folderPath = urlParts
        .slice(urlParts.indexOf("upload") + 1)
        .join("/");
      const publicId = folderPath ? `${folderPath}/${fileName}` : fileName;
      assetsToDelete.push({
        publicId,
        resource_type: "video",
      });
    }

    // Delete assets from Cloudinary
    if (assetsToDelete.length > 0) {
      console.log("Attempting to delete assets:", assetsToDelete);
      const deletionResults = await Promise.allSettled(
        assetsToDelete.map(({ publicId, resource_type }) =>
          cloudinary.uploader.destroy(publicId, {
            resource_type,
            timeout: 15000,
          })
        )
      );

      deletionResults.forEach((result, index) => {
        const { publicId, resource_type } = assetsToDelete[index];
        if (result.status === "fulfilled") {
          console.log(`Deleted ${resource_type} ${publicId}:`, result.value);
        } else {
          console.error(
            `Failed to delete ${resource_type} ${publicId}:`,
            result.reason
          );
        }
      });

      const failedDeletions = deletionResults.filter(
        (result) => result.status === "rejected"
      );
      if (failedDeletions.length > 0) {
        console.warn(`${failedDeletions.length} asset deletions failed`);
        // Continue with property deletion even if some assets fail
      }
    }

    // Delete property from MongoDB
    await Property.findByIdAndDelete(propertyId);

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete property error:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while deleting the property",
      },
      { status: 500 }
    );
  }
}
