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
        { error: "Unauthorized: You are not the owner" },
        { status: 403 }
      );
    }

    // Extract form data
    const listingTitle = formData.get("listingTitle");
    const category = formData.get("category");
    const type = formData.get("type");
    const country = formData.get("country");
    const state = formData.get("state");
    const street = formData.get("street");
    const city = formData.get("city");
    const zipcode = formData.get("zipcode");
    const currency = formData.get("currency");
    const actualPrice = parseFloat(
      formData.get("actualPrice")?.replace(/,/g, "") || "0"
    );
    const discountPrice = parseFloat(
      formData.get("discountPrice")?.replace(/,/g, "") || "0"
    );
    const description = formData.get("description");
    const beds = parseInt(formData.get("beds") || "0");
    const baths = parseInt(formData.get("baths") || "0");
    const squareFeet = parseInt(formData.get("square_feet") || "0");
    const sellerName = formData.get("seller_info.name");
    const sellerEmail = formData.get("seller_info.email");
    const sellerPhone = formData.get("seller_info.phone");
    const amenities = formData.getAll("amenities[]");
    const weeklyRate = parseFloat(
      formData.get("rates.weekly")?.replace(/,/g, "") || "0"
    );
    const monthlyRate = parseFloat(
      formData.get("rates.monthly")?.replace(/,/g, "") || "0"
    );
    const nightlyRate = parseFloat(
      formData.get("rates.nightly")?.replace(/,/g, "") || "0"
    );

    // Validate rates for For Rent
    if (
      type === "For Rent" &&
      weeklyRate === 0 &&
      monthlyRate === 0 &&
      nightlyRate === 0
    ) {
      return NextResponse.json(
        {
          error: "At least one rental rate is required for For Rent properties",
        },
        { status: 400 }
      );
    }

    // Handle image uploads
    const existingImages = JSON.parse(formData.get("existingImages") || "[]");
    const removedImages = JSON.parse(formData.get("removedImages") || "[]");
    const newImageUrls = [];

    // Upload new images
    const images = formData.getAll("images");
    for (const image of images) {
      if (image instanceof File && image.size > 0) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { resource_type: "image", timeout: 15000 },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });
        newImageUrls.push(result.secure_url);
      }
    }

    // Combine existing and new images, excluding removed ones
    const updatedImages = [
      ...existingImages.filter((url) => !removedImages.includes(url)),
      ...newImageUrls,
    ];

    // Delete removed images from Cloudinary
    if (removedImages.length > 0) {
      console.log("Attempting to delete images:", removedImages);
      const publicIds = removedImages.map((imageUrl) => {
        // Extract public ID, preserving folder path
        const urlParts = imageUrl.split("/");
        const fileName = urlParts.pop().split(".")[0];
        const folderPath = urlParts
          .slice(urlParts.indexOf("upload") + 1)
          .join("/");
        return folderPath ? `${folderPath}/${fileName}` : fileName;
      });

      try {
        const deletionResults = await Promise.allSettled(
          publicIds.map((publicId) =>
            cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
              timeout: 15000,
            })
          )
        );

        deletionResults.forEach((result, index) => {
          if (result.status === "fulfilled") {
            console.log(`Deleted image ${publicIds[index]}:`, result.value);
          } else {
            console.error(
              `Failed to delete image ${publicIds[index]}:`,
              result.reason
            );
          }
        });

        const failedDeletions = deletionResults.filter(
          (result) => result.status === "rejected"
        );
        if (failedDeletions.length > 0) {
          console.warn(`${failedDeletions.length} image deletions failed`);
          // Optionally, fail the request if deletions are critical
          // return NextResponse.json(
          //   { error: "Failed to delete some images from Cloudinary" },
          //   { status: 500 }
          // );
        }
      } catch (error) {
        console.error("Error during bulk image deletion:", error);
      }
    }

    // Handle video upload
    let videoUrl = property.videoUrl;
    const video = formData.get("video");
    if (video instanceof File && video.size > 0) {
      if (video.size > 50 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Video file must be less than 50MB" },
          { status: 400 }
        );
      }
      const arrayBuffer = await video.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "video", timeout: 15000 },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });
      videoUrl = result.secure_url;
      // Delete old video if it exists
      if (property.videoUrl) {
        try {
          const publicId = property.videoUrl.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
            timeout: 15000,
          });
        } catch (error) {
          console.error(`Failed to delete video ${property.videoUrl}:`, error);
        }
      }
    } else if (!video && property.videoUrl && !videoPreview) {
      // Remove video if input is cleared
      try {
        const publicId = property.videoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "video",
          timeout: 15000,
        });
        videoUrl = null;
      } catch (error) {
        console.error(`Failed to delete video ${property.videoUrl}:`, error);
      }
    }

    // Update property
    property.name = listingTitle;
    property.category = category;
    property.isForSale = type === "For Sale";
    property.location = { country, state, street, city, zipcode };
    property.currency = currency;
    property.price = actualPrice;
    property.discount = discountPrice || 0;
    property.description = description;
    property.beds = beds;
    property.baths = baths;
    property.square_feet = squareFeet;
    property.seller_info = {
      name: sellerName || "",
      email: sellerEmail,
      phone: sellerPhone || "",
    };
    property.amenities = amenities;
    property.rates = {
      weekly: weeklyRate || 0,
      monthly: monthlyRate || 0,
      nightly: nightlyRate || 0,
    };
    property.images = updatedImages;
    property.videoUrl = videoUrl;

    await property.save();

    return NextResponse.json(
      { message: "Property updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Edit property error:", error);
    return NextResponse.json(
      {
        error: error.message || "An error occurred while updating the property",
      },
      { status: 500 }
    );
  }
}
