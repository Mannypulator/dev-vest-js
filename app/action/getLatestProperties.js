import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

export default async function getLatestProperties(limit) {
  try {
    await connectDB();

    // Fetch properties with lean() to get plain objects
    const properties = await Property.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit)
      .lean();

    // Serialize all properties
    const serializedProperties = properties.map((property) =>
      convertToSerializeableObject(property)
    );

    return {
      success: true,
      properties: serializedProperties,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      properties: [],
      error: "Failed to fetch properties",
    };
  }
}
