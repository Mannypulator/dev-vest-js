"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";

async function getFilteredProperties({
  location,
  propertyType,
  maximumPrice,
  currency,
  isForSale,
}) {
  await connectDB();

  try {
    const query = {};

    if (location) {
      query["$or"] = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
      ];
    }

    if (propertyType && propertyType !== "All") {
      query.type = propertyType;
    }

    if (maximumPrice) {
      const maxPrice = parseFloat(maximumPrice.replace(/[^0-9.]/g, ""));
      if (!isNaN(maxPrice)) {
        if (isForSale === "Sale") {
          query.price = { $lte: maxPrice };
        } else if (isForSale === "Rent") {
          query["$or"] = [
            { "rates.monthly": { $lte: maxPrice } },
            { "rates.weekly": { $lte: maxPrice } },
            { "rates.nightly": { $lte: maxPrice } },
          ];
        } else {
          query["$or"] = [
            { price: { $lte: maxPrice } },
            { "rates.monthly": { $lte: maxPrice } },
            { "rates.weekly": { $lte: maxPrice } },
            { "rates.nightly": { $lte: maxPrice } },
          ];
        }
      }
    }

    if (currency && currency !== "All") {
      query.currency = currency;
    }

    if (isForSale === "Sale") {
      query.isForSale = true;
    } else if (isForSale === "Rent") {
      query.isForSale = false;
    }

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("owner", "firstName lastName email")
      .lean();

    if (!properties || properties.length === 0) {
      return { success: false, error: "No properties found" };
    }

    return { success: true, properties };
  } catch (error) {
    console.error("Error fetching filtered properties:", error);
    return { error: "An error occurred while fetching properties" };
  }
}

export default getFilteredProperties;