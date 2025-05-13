import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

export default async function getLatestProperties(limit) {
  try {
    await connectDB();

    // Build query
    let query = Property.find().sort({ createdAt: -1 }).lean();

    // Apply limit only if provided and not null
    if (limit !== null && limit !== undefined) {
      query = query.limit(limit);
    }

    // Fetch properties
    const properties = await query;

    // Log the number of properties fetched
    console.log(`Fetched ${properties.length} properties with limit: ${limit}`);

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
    console.error("Error fetching properties:", {
      message: error.message,
      stack: error.stack,
      limit,
    });
    return {
      success: false,
      properties: [],
      error: "Failed to fetch properties",
    };
  }
}
