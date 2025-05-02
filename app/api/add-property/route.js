import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import cloudinary from "@/config/cloudinary";

// Add bodyParser configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow up to 10MB
    },
  },
};

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 401 }
      );
    }

    const { userId } = sessionUser;

    // Validate userId is a valid ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID format" },
        { status: 400 }
      );
    }

    // Log formData type and content for debugging
    console.log(
      "Server-side formData type:",
      Object.prototype.toString.call(formData)
    );
    console.log(
      "Server-side formData instanceof FormData:",
      formData instanceof FormData
    );
    if (formData instanceof FormData) {
      console.log("Server-side FormData entries:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }
    } else {
      console.log(
        "Server-side formData content:",
        JSON.stringify(formData, null, 2)
      );
    }

    // Validate that formData is a FormData instance
    if (!(formData instanceof FormData)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid form data: Expected FormData, received ${typeof formData}`,
        },
        { status: 400 }
      );
    }

    // Handle amenities
    let amenities = formData.getAll("amenities[]");
    if (!amenities || amenities.length === 0) {
      amenities = formData.getAll("amenities").filter((a) => a !== "");
    }

    // Handle images
    const images = formData
      .getAll("images")
      .filter((image) => image instanceof File && image.name !== "");

    // Handle video
    const videoFile = formData.get("video");
    let videoUrl = null;
    if (videoFile instanceof File && videoFile.name !== "") {
      try {
        const videoBuffer = await videoFile.arrayBuffer();
        const videoData = Buffer.from(videoBuffer);

        // Stream video to Cloudinary
        videoUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "propertypulse",
              resource_type: "video",
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(videoData);
        });
      } catch (error) {
        console.error("Video upload error:", error);
        return NextResponse.json(
          { success: false, message: "Failed to upload video" },
          { status: 500 }
        );
      }
    }

    const validCurrencies = ["NGN", "USD", "EUR", "GBP", "CAD"];
    const currency = formData.get("currency") || "USD";
    if (!validCurrencies.includes(currency)) {
      return NextResponse.json(
        { success: false, message: "Invalid currency code" },
        { status: 400 }
      );
    }

    // Create propertyData object
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("listingTitle"),
      description: formData.get("description"),
      isForSale: formData.get("type") === "For Sale",
      price: parseFloat(formData.get("actualPrice")?.replace(/,/g, "")) || null,
      discount:
        parseFloat(formData.get("discountPrice")?.replace(/,/g, "")) || null,
      currency: formData.get("currency") || "USD",
      location: {
        street: formData.get("street"),
        city: formData.get("city"),
        state: formData.get("state"),
        country: formData.get("country"),
        zipcode: formData.get("zipcode"),
      },
      beds: parseInt(formData.get("beds"), 10),
      baths: parseInt(formData.get("baths"), 10),
      square_feet: parseInt(formData.get("square_feet"), 10),
      amenities,
      rates: {
        weekly: formData.get("rates.weekly")
          ? parseFloat(formData.get("rates.weekly").replace(/,/g, ""))
          : null,
        monthly: formData.get("rates.monthly")
          ? parseFloat(formData.get("rates.monthly").replace(/,/g, ""))
          : null,
        nightly: formData.get("rates.nightly")
          ? parseFloat(formData.get("rates.nightly").replace(/,/g, ""))
          : null,
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
      images: [],
      videoUrl,
    };

    // For For Rent: Map actualPrice to rates.monthly if no rates provided
    if (
      !propertyData.isForSale &&
      !propertyData.rates.monthly &&
      !propertyData.rates.weekly &&
      !propertyData.rates.nightly
    ) {
      if (propertyData.price) {
        propertyData.rates.monthly = propertyData.price;
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "At least one rental rate or price is required for For Rent properties",
          },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!propertyData.type || !propertyData.name || !propertyData.description) {
      return NextResponse.json(
        { success: false, message: "Type, name, and description are required" },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const validImageFormats = ["image/jpeg", "image/png", "image/webp"];
    const imageUploadPromises = images.map(async (imageFile) => {
      try {
        if (!validImageFormats.includes(imageFile.type)) {
          throw new Error(
            `Invalid image format for ${imageFile.name}. Allowed: JPEG, PNG, WebP`
          );
        }
        if (imageFile.size > 5 * 1024 * 1024) {
          throw new Error(`Image ${imageFile.name} exceeds 5MB limit`);
        }
        const imageBuffer = await imageFile.arrayBuffer();
        const imageData = Buffer.from(imageBuffer);
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "propertypulse",
              resource_type: "image",
              transformation: { quality: "auto", fetch_format: "auto" },
              timeout: 15000,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          uploadStream.end(imageData);
        });
      } catch (error) {
        console.error(
          `Failed to upload image ${imageFile.name}:`,
          error.message
        );
        throw error;
      }
    });

    try {
      const imageUrls = await Promise.all(imageUploadPromises);
      propertyData.images = imageUrls;
    } catch (error) {
      console.error("Image upload error:", error.message);
      return NextResponse.json(
        { success: false, message: error.message || "Failed to upload image" },
        { status: 400 }
      );
    }

    // Save property to MongoDB
    const newProperty = new Property(propertyData);
    await newProperty.save();

    return NextResponse.json(
      { success: true, propertyId: newProperty._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add property error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add property" },
      { status: 500 }
    );
  }
}
