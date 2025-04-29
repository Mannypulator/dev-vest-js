import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

export async function POST(request) {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const propertyId = formData.get("propertyId");
    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.owner.toString() !== sessionUser.userId) {
      return NextResponse.json(
        { error: "Unauthorized: You do not own this property" },
        { status: 403 }
      );
    }

    // Extract form fields
    const updates = {
      name: formData.get("listingTitle"),
      type: formData.get("type"),
      category: formData.get("category"),
      description: formData.get("description"),
      location: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipcode: formData.get("zipcode"),
      },
      beds: parseInt(formData.get("beds")),
      baths: parseInt(formData.get("baths")),
      square_feet: parseInt(formData.get("square_feet")),
      amenities: formData.getAll("amenities[]"),
      rates: {
        nightly: formData.get("rates.nightly")
          ? parseFloat(formData.get("rates.nightly").replace(/,/g, ""))
          : null,
        weekly: formData.get("rates.weekly")
          ? parseFloat(formData.get("rates.weekly").replace(/,/g, ""))
          : null,
        monthly: formData.get("rates.monthly")
          ? parseFloat(formData.get("rates.monthly").replace(/,/g, ""))
          : null,
      },
      price: parseFloat(formData.get("actualPrice").replace(/,/g, "")),
      discount: formData.get("discountPrice")
        ? parseFloat(formData.get("discountPrice").replace(/,/g, ""))
        : null,
      currency: formData.get("currency"),
      isForSale: formData.get("type") === "For Sale",
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
    };

    // Handle image uploads
    const images = formData.getAll("images");
    const newImageUrls = [];
    for (const image of images) {
      if (image instanceof File && image.size > 0) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "properties" }, (error, result) => {
              if (error) reject(error);
              else resolve(result);
            })
            .end(buffer);
        });
        newImageUrls.push(result.secure_url);
      }
    }
    if (newImageUrls.length > 0) {
      updates.images = [...(property.images || []), ...newImageUrls];
    }

    // Handle video upload
    const video = formData.get("video");
    if (video instanceof File && video.size > 0) {
      const arrayBuffer = await video.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "video", folder: "property_videos" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
      updates.videoUrl = result.secure_url;
    }

    // Validate rates for rentals
    if (
      !updates.isForSale &&
      !updates.rates.nightly &&
      !updates.rates.weekly &&
      !updates.rates.monthly
    ) {
      return NextResponse.json(
        {
          error: "At least one rental rate is required for For Rent properties",
        },
        { status: 400 }
      );
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $set: updates },
      { new: true }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Property updated successfully",
        property: updatedProperty,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit property error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update property" },
      { status: 500 }
    );
  }
}
