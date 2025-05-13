"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Ruler } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { assets } from "@/assets/assets";

const SavedPropertiesList = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return <p className="text-gray-600">No saved properties found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Link
          key={property._id}
          href={`/properties/${property._id}`}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="overflow-hidden bg-gray-500/10 rounded-t-lg">
            <Image
              src={property.images[0] || assets.property1}
              alt={property.name}
              height={200}
              width={400}
              sizes="300px"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {property.name}
            </h3>
            <p className="text-gray-600 mb-2">{property.type}</p>
            <p className="text-gray-600 mb-2">
              {property.location.street}, {property.location.city},{" "}
              {property.location.state}
            </p>
            <p className="text-[#E6B027] font-bold mb-2">
              {formatPrice(property.price, property.currency)}
            </p>
            <div className="flex justify-between text-gray-600 text-sm">
              <p>
                <Bed className="inline-block mr-1" size={16} />
                {property.beds} Beds
              </p>
              <p>
                <Bath className="inline-block mr-1" size={16} />
                {property.baths} Baths
              </p>
              <p>
                <Ruler className="inline-block mr-1" size={16} />
                {property.square_feet} sqft
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SavedPropertiesList;
