import connectDB from "@/config/database";
import Property from "@/models/Property";

export async function getPropertiesByUser(userId) {
  await connectDB();
  const properties = await Property.find({ userId }).lean();
  return properties;
}
