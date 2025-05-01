export const currencyDisplayMap = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
};

export const validCurrencies = ["NGN", "USD", "EUR", "GBP", "CAD"];

export const formatPrice = (price, currency = "USD", locale = "en-NG") => {
  if (!price || isNaN(price)) return "N/A";
  const isoCurrency = validCurrencies.includes(currency) ? currency : "USD";
  try {
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: isoCurrency,
      currencyDisplay: "symbol",
    }).format(price);
    return isoCurrency === "NGN"
      ? formatted.replace("NGN", currencyDisplayMap.NGN)
      : formatted;
  } catch (error) {
    console.error(`Error formatting price: ${currency}`, error);
    const displayCurrency = currencyDisplayMap[isoCurrency] || "$";
    return `${displayCurrency}${price.toLocaleString()}`;
  }
};
