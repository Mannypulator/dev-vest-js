"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";

async function getPropertyById(propertyId) {
  await connectDB();

  try {
    // Find property by ID and populate owner details
    const property = await Property.findById(propertyId).populate(
      "owner",
      "firstName lastName email"
    );

    if (!property) {
      return { error: "Property not found" };
    }

    // Convert Mongoose document to plain object
    const propertyData = property.toObject();

    return { success: true, property: propertyData };
  } catch (error) {
    console.error("Error fetching property:", error);
    return { error: "An error occurred while fetching the property" };
  }
}

export default getPropertyById;
