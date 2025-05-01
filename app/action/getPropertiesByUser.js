import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

export async function getPropertiesByUser(userId) {
  try {
    await connectDB();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Query properties where owner matches userId
    const properties = await Property.find({ owner: userId }).lean();

    // Convert to serializable objects
    return convertToSerializeableObject(properties) || [];
  } catch (error) {
    console.error("Error in getPropertiesByUser:", error);
    return []; // Return empty array on error
  }
}
