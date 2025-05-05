import connectDB from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializeableObject } from "@/utils/convertToObject";

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

    if (location && location.trim()) {
      const trimmedLocation = location.trim();
      query["$or"] = [
        { "location.city": { $regex: trimmedLocation, $options: "i" } },
        { "location.state": { $regex: trimmedLocation, $options: "i" } },
        { "location.country": { $regex: trimmedLocation, $options: "i" } },
      ];
    }

    if (propertyType && propertyType !== "All") {
      query.type = propertyType;
    }

    if (maximumPrice) {
      // Log raw input for debugging
      console.log(`Raw maximumPrice input: ${maximumPrice}`);
      // Remove all non-numeric chars except decimal, ensure single decimal point
      const cleanedPrice = maximumPrice
        .replace(/[^0-9.]/g, "") // Keep only digits and decimal
        .replace(/\.{2,}/g, ".") // Replace multiple decimals with one
        .replace(/^\.|\.$/g, ""); // Remove leading/trailing decimal
      const maxPrice = parseFloat(cleanedPrice);
      console.log(`Parsed maxPrice: ${maxPrice}`);
      if (!isNaN(maxPrice) && maxPrice > 0) {
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
      } else {
        console.warn(
          `Invalid maximumPrice: ${maximumPrice} (parsed: ${cleanedPrice}). Ignoring price filter.`
        );
      }
    }

    if (currency && currency !== "All") {
      const validCurrencies = ["NGN", "USD", "EUR", "GBP", "CAD"];
      // Map currency symbols to ISO codes
      const symbolToCodeMap = {
        "₦": "NGN",
        $: "USD",
        "€": "EUR",
        "£": "GBP",
        C$: "CAD",
      };
      // Check if currency is a symbol and convert to code, otherwise normalize
      let normalizedCurrency = currency;
      if (symbolToCodeMap[currency]) {
        normalizedCurrency = symbolToCodeMap[currency];
      } else {
        normalizedCurrency = currency.toUpperCase();
      }
      if (validCurrencies.includes(normalizedCurrency)) {
        query.currency = normalizedCurrency;
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
    console.error("Error fetching filtered properties:", error);
    return { error: "An error occurred while fetching properties" };
  }
}

export default getFilteredProperties;
