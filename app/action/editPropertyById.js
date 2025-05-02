"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";

async function editPropertyById(propertyId, formData) {
  await connectDB();

  const sessionUser = await getSessionUser();

  if (!sessionUser || !sessionUser.userId) {
    throw new Error("User ID is required");
  }

  const { userId } = sessionUser;

  // Find the property and verify ownership
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }
  if (property.owner.toString() !== userId) {
    throw new Error("You are not authorized to edit this property");
  }

  const amenities = formData.getAll("amenities");
  const images = formData.getAll("images").filter((image) => image.name !== "");

  // Create the updated property data object
  const propertyData = {
    type: formData.get("type"),
    name: formData.get("name"),
    description: formData.get("description"),
    isForSale: formData.get("isForSale") === "true", // Convert string to boolean
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    discount: formData.get("discount")
      ? Number(formData.get("discount"))
      : undefined,
    location: {
      street: formData.get("location.street"),
      city: formData.get("location.city"),
      state: formData.get("location.state"),
      zipcode: formData.get("location.zipcode"),
    },
    beds: Number(formData.get("beds")),
    baths: Number(formData.get("baths")),
    square_feet: Number(formData.get("square_feet")),
    amenities,
    rates: {
      nightly: formData.get("rates.nightly")
        ? Number(formData.get("rates.nightly"))
        : undefined,
      weekly: formData.get("rates.weekly")
        ? Number(formData.get("rates.weekly"))
        : undefined,
      monthly: formData.get("rates.monthly")
        ? Number(formData.get("rates.monthly"))
        : undefined,
    },
    seller_info: {
      name: formData.get("seller_info.name"),
      email: formData.get("seller_info.email"),
      phone: formData.get("seller_info.phone"),
    },
    videoUrl: formData.get("videoUrl"),
    is_featured: formData.get("is_featured") === "true", // Convert string to boolean
  };

  // Handle image uploads if new images are provided
  if (images.length > 0) {
    const imageUrls = [];

    for (const imageFile of images) {
      const imageBuffer = await imageFile.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // Convert the image data to base64
      const imageBase64 = imageData.toString("base64");

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: "propertypulse",
        }
      );

      imageUrls.push(result.secure_url);
    }

    propertyData.images = imageUrls;
  }

  // Update the property
  const updatedProperty = await Property.findByIdAndUpdate(
    propertyId,
    { $set: propertyData },
    { new: true, runValidators: true }
  );

  if (!updatedProperty) {
    throw new Error("Failed to update property");
  }

  revalidatePath("/", "layout");
  redirect(`/properties/${updatedProperty._id}`);
}

export default editPropertyById;
