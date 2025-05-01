"use client";
import { useState } from "react";
import {
  Bed,
  Bath,
  Ruler,
  X as Times,
  Check,
  MapPin as MapMarker,
  User,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Link from "next/link";

const PropertyDetails = ({ property }) => {
  const [mainImage, setMainImage] = useState(null);

  // Map currency symbols to ISO 4217 codes
  const currencyMap = {
    "₦": "NGN",
    $: "USD",
    "€": "EUR",
    "£": "GBP",
    CAD: "CAD",
  };

  // Format price
  const formatPrice = (price, currency = "$") => {
    if (!price) return "N/A";

    // Handle malformed or invalid currency
    let isoCurrency = currencyMap[currency] || "USD"; // Fallback to USD
    if (!isoCurrency) {
      console.warn(
        `Invalid currency code: ${currency}. Using USD as fallback.`
      );
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: isoCurrency,
      }).format(price);
    } catch (error) {
      console.error(`Error formatting price with currency ${currency}:`, error);
      return `${currency}${price.toLocaleString()}`; // Fallback formatting
    }
  };

  // Guard clause for missing property
  if (!property) {
    return (
      <div className="text-center text-red-500">
        Error: Property data not available
      </div>
    );
  }

  return (
    <main>
      {/* Breadcrumbs */}
      <div className="sm:text-sm text-xs text-gray-500 flex items-center gap-2 mb-4">
        <Link href="/" className="hover:text-[#E6B027]">
          Home
        </Link>
        <span className="text-[#E6B027]">›</span>
        <Link href="/properties" className="hover:text-[#E6B027]">
          Properties
        </Link>
        <span className="text-[#E6B027]">›</span>
        <span className="text-[#E6B027] font-semibold">{property.name}</span>
      </div>

      {/* Image Section */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <div className="flex flex-col md:flex-row sm:gap-4 gap-2 sm:p-6 p-2">
            {/* Secondary Images (Left, Vertical) */}
            <div className="flex md:flex-col flex-row sm:gap-2 gap-1 md:w-1/4">
              {property.images.map((image, index) => (
                <div
                  key={`secondary-image-${index}`}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image}
                    alt={`${property.name} image ${index + 1}`}
                    height={20}
                    width={40}
                    sizes="150px"
                    className="w-full h-full sm:h-[100px] object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Main Image (Right, Larger) */}
            <div className="w-full md:w-3/4 rounded-lg overflow-hidden bg-gray-500/10">
              <Image
                src={mainImage || property.images[0]}
                alt={property.name || "Property"}
                height={100}
                width={200}
                sizes="(max-width: 768px) 100vw, 800px"
                className="w-full md:h-[500px] object-cover"
                priority={true}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden bg-gray-500/10">
            <Image
              src={assets.property1}
              alt="No image available"
              height={400}
              width={800}
              sizes="(max-width: 768px) 100vw, 800px"
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="bg-white sm:p-6 p-2 rounded-lg shadow-md text-center md:text-left">
        <div className="text-gray-500 mb-4">{property.type}</div>
        <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <MapMarker className="text-[#E6B027] mt-1 mr-1" />
          <p className="text-[#E6B027]">
            {property.location?.street}, {property.location?.city},{" "}
            {property.location?.state}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
          <div className="text-gray-600 mr-2 font-bold">Price</div>
          <div className="md:text-2xl sm:text-lg text-base flex flex-col sm:flex-row items-center gap-2 font-bold text-[#E6B027]">
            <div>{formatPrice(property.price, property.currency)}</div>
            {property.discount && (
              <div className="text-gray-600 line-through md:text-lg sm:text-base text-xs">
                {formatPrice(property.discount, property.currency)}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold my-6 bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white p-2 rounded">
          Rates & Options
        </h3>
        <div className="flex flex-col md:flex-row justify-around">
          {/* Nightly */}
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-600 mr-2 font-bold">Nightly</div>
            <div className="text-2xl font-bold text-[#E6B027]">
              {property.rates?.nightly ? (
                formatPrice(property.rates.nightly, property.currency)
              ) : (
                <Times className="text-red-500" />
              )}
            </div>
          </div>
          {/* Weekly */}
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-600 mr-2 font-bold">Weekly</div>
            <div className="text-2xl font-bold text-[#E6B027]">
              {property.rates?.weekly ? (
                formatPrice(property.rates.weekly, property.currency)
              ) : (
                <Times className="text-red-500" />
              )}
            </div>
          </div>
          {/* Monthly */}
          <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
            <div className="text-gray-600 mr-2 font-bold">Monthly</div>
            <div className="text-2xl font-bold text-[#E6B027]">
              {property.rates?.monthly ? (
                formatPrice(property.rates.monthly, property.currency)
              ) : (
                <Times className="text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="mt-6 md:text-base sm:text-sm text-xs flex flex-col">
          <h3 className="text-lg font-bold mb-2">Owner Information</h3>
          <div className="flex items-center gap-2 text-gray-600">
            <Image src={assets.person_icon} alt="person icon" />
            <p>
              {property.owner?.firstName} {property.owner?.lastName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Image src={assets.mail_icon} alt="mail icon" />
            <p>{property.owner?.email}</p>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Description & Details</h3>
        <div className="flex justify-center gap-4 text-gray-600 mb-4 text-xl space-x-9">
          <p>
            <Bed color="#E6B027" className="inline-block mr-2" />
            {property.beds} <span className="hidden sm:inline">Beds</span>
          </p>
          <p>
            <Bath color="#E6B027" className="inline-block mr-2" />
            {property.baths} <span className="hidden sm:inline">Baths</span>
          </p>
          <p>
            <Ruler color="#E6B027" className="inline-block mr-2" />
            {property.square_feet}{" "}
            <span className="hidden sm:inline">sqft</span>
          </p>
        </div>
        <p className="text-gray-600 mb-4">{property.description}</p>
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Amenities</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {property.amenities?.map((amenity, index) => (
            <li key={index}>
              <Check className="inline-block text-green-600 mr-2" /> {amenity}
            </li>
          ))}
        </ul>
      </div>

      {/* Video Tour */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Property Tour</h3>
        {property.videoUrl ? (
          <video
            className="w-full rounded-lg"
            controls
            poster={property.images?.[0]}
          >
            <source src={property.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-gray-600 italic">
            No video tour available for this property.
          </p>
        )}
      </div>
    </main>
  );
};

export default PropertyDetails;
