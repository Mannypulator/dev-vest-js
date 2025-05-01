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
import { formatPrice, currencyDisplayMap } from "@/utils/currency";

const PropertyDetails = ({ property }) => {
  const [mainImage, setMainImage] = useState(null);

  // Guard clause for missing property
  if (!property) {
    return (
      <div className="text-center text-red-500">
        Error: Property data not available
      </div>
    );
  }

  // Default values for missing fields
  const safeProperty = {
    name: property.name || "Unnamed Property",
    type: property.type || "Unknown",
    images: Array.isArray(property.images) ? property.images : [],
    location: {
      street: property.location?.street || "",
      city: property.location?.city || "",
      state: property.location?.state || "",
    },
    price: property.price || 0,
    currency: property.currency || "USD",
    discount: property.discount || null,
    rates: {
      nightly: property.rates?.nightly || null,
      weekly: property.rates?.weekly || null,
      monthly: property.rates?.monthly || null,
    },
    owner: {
      firstName: property.owner?.firstName || "Unknown",
      lastName: property.owner?.lastName || "",
      email: property.owner?.email || "N/A",
    },
    beds: property.beds || 0,
    baths: property.baths || 0,
    square_feet: property.square_feet || 0,
    description: property.description || "No description available",
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    videoUrl: property.videoUrl || null,
  };

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
        <span className="text-[#E6B027] font-semibold">
          {safeProperty.name}
        </span>
      </div>

      {/* Image Section */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
        {safeProperty.images.length > 0 ? (
          <div className="flex flex-col md:flex-row sm:gap-4 gap-2 sm:p-6 p-2">
            {/* Secondary Images (Left, Vertical) */}
            <div className="flex md:flex-col flex-row sm:gap-2 gap-1 md:w-1/4">
              {safeProperty.images.map((image, index) => (
                <div
                  key={`secondary-image-${index}`}
                  onClick={() => setMainImage(image)}
                  className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                >
                  <Image
                    src={image}
                    alt={`${safeProperty.name} image ${index + 1}`}
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
                src={mainImage || safeProperty.images[0]}
                alt={safeProperty.name}
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
        <div className="text-gray-500 mb-4">{safeProperty.type}</div>
        <h1 className="text-3xl font-bold mb-4">{safeProperty.name}</h1>
        <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
          <MapMarker className="text-[#E6B027] mt-1 mr-1" />
          <p className="text-[#E6B027]">
            {safeProperty.location.street}, {safeProperty.location.city},{" "}
            {safeProperty.location.state}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
          <div className="text-gray-600 mr-2 font-bold">Price</div>
          <div className="md:text-2xl sm:text-lg text-base flex flex-col sm:flex-row items-center gap-2 font-bold text-[#E6B027]">
            <div>{formatPrice(safeProperty.price, safeProperty.currency)}</div>
            {safeProperty.discount && (
              <div className="text-gray-600 line-through md:text-lg sm:text-base text-xs">
                {formatPrice(safeProperty.discount, safeProperty.currency)}
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
              {safeProperty.rates.nightly ? (
                formatPrice(safeProperty.rates.nightly, safeProperty.currency)
              ) : (
                <Times className="text-red-500" />
              )}
            </div>
          </div>
          {/* Weekly */}
          <div className="flex items-center justify-center mb-4 border-b border-gray-200 md:border-b-0 pb-4 md:pb-0">
            <div className="text-gray-600 mr-2 font-bold">Weekly</div>
            <div className="text-2xl font-bold text-[#E6B027]">
              {safeProperty.rates.weekly ? (
                formatPrice(safeProperty.rates.weekly, safeProperty.currency)
              ) : (
                <Times className="text-red-500" />
              )}
            </div>
          </div>
          {/* Monthly */}
          <div className="flex items-center justify-center mb-4 pb-4 md:pb-0">
            <div className="text-gray-600 mr-2 font-bold">Monthly</div>
            <div className="text-2xl font-bold text-[#E6B027]">
              {safeProperty.rates.monthly ? (
                formatPrice(safeProperty.rates.monthly, safeProperty.currency)
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
              {safeProperty.owner.firstName} {safeProperty.owner.lastName}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Image src={assets.mail_icon} alt="mail icon" />
            <p>{safeProperty.owner.email}</p>
          </div>
        </div>
      </div>

      {/* Description & Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Description & Details</h3>
        <div className="flex justify-center gap-4 text-gray-600 mb-4 text-xl space-x-9">
          <p>
            <Bed color="#E6B027" className="inline-block mr-2" />
            {safeProperty.beds} <span className="hidden sm:inline">Beds</span>
          </p>
          <p>
            <Bath color="#E6B027" className="inline-block mr-2" />
            {safeProperty.baths} <span className="hidden sm:inline">Baths</span>
          </p>
          <p>
            <Ruler color="#E6B027" className="inline-block mr-2" />
            {safeProperty.square_feet}{" "}
            <span className="hidden sm:inline">sqft</span>
          </p>
        </div>
        <p className="text-gray-600 mb-4">{safeProperty.description}</p>
      </div>

      {/* Amenities */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Amenities</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 list-none space-y-2">
          {safeProperty.amenities.map((amenity, index) => (
            <li key={index}>
              <Check className="inline-block text-green-600 mr-2" /> {amenity}
            </li>
          ))}
        </ul>
      </div>

      {/* Video Tour */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-6">Property Tour</h3>
        {safeProperty.videoUrl ? (
          <video
            className="w-full rounded-lg"
            controls
            poster={safeProperty.images[0] || assets.property1}
          >
            <source src={safeProperty.videoUrl} type="video/mp4" />
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
