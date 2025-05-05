import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import mongoose from "mongoose";

async function getFilteredProperties({
  location,
  propertyType,
  maximumPrice,
  currency,
  isForSale,
}) {
  try {
    // Verify database connection
    await connectDB();
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not established");
    }

    const query = {};

    if (location && location.trim()) {
      const trimmedLocation = location.trim();
      query["$or"] = [
        {
          "location.city": {
            $regex: trimmedLocation,
            $options: "i",
            $exists: true,
          },
        },
        {
          "location.state": {
            $regex: trimmedLocation,
            $options: "i",
            $exists: true,
          },
        },
        {
          "location.country": {
            $regex: trimmedLocation,
            $options: "i",
            $exists: true,
          },
        },
      ];
    }

    if (propertyType && propertyType !== "All") {
      query.type = propertyType;
    }

    if (maximumPrice && maximumPrice.trim()) {
      // Log raw input for debugging
      console.log(`Raw maximumPrice input: ${maximumPrice}`);
      // Remove all non-numeric chars except one decimal point
      const cleanedPrice = maximumPrice
        .replace(/[^0-9.]/g, "") // Keep only digits and decimal
        .replace(/\.{2,}/g, ".") // Replace multiple decimals with one
        .replace(/^\.|\.$/g, ""); // Remove leading/trailing decimal
      const maxPrice = parseFloat(cleanedPrice || "0");
      console.log(
        `Parsed maxPrice: ${maxPrice}, Cleaned input: ${cleanedPrice}`
      );
      if (!isNaN(maxPrice) && maxPrice > 0) {
        if (isForSale === "Sale") {
          query.price = { $lte: maxPrice, $exists: true };
        } else if (isForSale === "Rent") {
          // Prioritize monthly rates, fall back to others
          query["$or"] = [
            { "rates.monthly": { $lte: maxPrice, $exists: true } },
            { "rates.weekly": { $lte: maxPrice, $exists: true } },
            { "rates.nightly": { $lte: maxPrice, $exists: true } },
          ];
        } else {
          query["$or"] = [
            { price: { $lte: maxPrice, $exists: true } },
            { "rates.monthly": { $lte: maxPrice, $exists: true } },
            { "rates.weekly": { $lte: maxPrice, $exists: true } },
            { "rates.nightly": { $lte: maxPrice, $exists: true } },
          ];
        }
      } else {
        console.warn(
          `Invalid maximumPrice: ${maximumPrice} (cleaned: ${cleanedPrice}, parsed: ${maxPrice}). Ignoring price filter.`
        );
      }
    } else {
      console.log(`maximumPrice is empty or whitespace: ${maximumPrice}`);
    }

    if (currency && currency !== "All") {
      const validCurrencies = ["NGN", "USD", "EUR", "GBP", "CAD"];
      // Map currency symbols to ISO codes
      const symbolToCodeMap = {
        "₦": "NGN",
        "$": "USD",
        "€": "EUR",
        "£": "GBP",
        "C$": "CAD",
      };
      // Check if currency is a symbol and convert to code, otherwise normalize
      let normalizedCurrency = currency;
      if (symbolToCodeMap[currency]) {
        normalizedCurrency = symbolToCodeMap[currency];
      } else {
        normalizedCurrency = currency.toUpperCase();
      }
      if (validCurrencies.includes(normalizedCurrency)) {
        query.currency = { $eq: normalizedCurrency, $exists: true };
      } else {
        console.warn(
          `Invalid currency code: ${currency}. Ignoring currency filter.`
        );
      }
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

    // Convert properties to plain objects
    const serializedProperties = properties.map((property) =>
      convertToSerializeableObject(property)
    );

    return { success: true, properties: serializedProperties };
  } catch (error) {
    console.error("Error fetching filtered properties:", {
      error: error.message,
      stack: error.stack,
      input: { location, propertyType, maximumPrice, currency, isForSale },
      query: JSON.stringify(query || {}),
    });
    return { error: "An error occurred while fetching properties" };
  }
}

export default getFilteredProperties;
