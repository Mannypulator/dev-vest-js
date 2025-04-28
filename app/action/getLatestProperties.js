"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";

async function getLatestProperties(limit = 4) {
  await connectDB();

  try {
    const properties = await Property.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("owner", "firstName lastName email")
      .lean();

    if (!properties || properties.length === 0) {
      return { success: false, error: "No properties found" };
    }

    console.log(
      "Fetched properties:",
      properties.map((p) => ({
        _id: p._id,
        type: p.type,
        isForSale: p.isForSale,
        price: p.price,
        rates: p.rates,
      }))
    );

    return { success: true, properties };
  } catch (error) {
    console.error("Error fetching latest properties:", error);
    return { error: "An error occurred while fetching properties" };
  }
}

export default getLatestProperties;
