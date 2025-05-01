"use client";

import React from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import { Bed, Bath, Ruler, MapPin, Banknote } from "lucide-react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { useSession } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const PropertyCard = ({ property }) => {
  const { data: session, status } = useSession();

  const getRatesDisplayed = () => {
    const currency = property.currency || "$"; // Default to $ if currency not stored
    // For Sale: Use price if valid
    if (
      property.isForSale &&
      typeof property.price === "number" &&
      property.price > 0
    ) {
      return `${currency}${property.price.toLocaleString()}`;
    }
    // For Rent: Prioritize rates, fall back to price
    if (!property.isForSale) {
      if (
        typeof property.rates?.monthly === "number" &&
        property.rates.monthly > 0
      ) {
        return `${currency}${property.rates.monthly.toLocaleString()}/mo`;
      }
      if (
        typeof property.rates?.weekly === "number" &&
        property.rates.weekly > 0
      ) {
        return `${currency}${property.rates.weekly.toLocaleString()}/wk`;
      }
      if (
        typeof property.rates?.nightly === "number" &&
        property.rates.nightly > 0
      ) {
        return `${currency}${property.rates.nightly.toLocaleString()}/night`;
      }
      if (typeof property.price === "number" && property.price > 0) {
        return `${currency}${property.price.toLocaleString()}/mo`; // Assume monthly
      }
    }
    return "Price unavailable";
  };

  return (
    <div className={`rounded-xl shadow-md relative ${poppins.className}`}>
      <Link href={`/properties/${property._id}`}>
        <Image
          src={
            property.images && property.images[0]
              ? property.images[0]
              : assets.property1
          }
          alt=""
          height={0}
          width={0}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full max-h-[200px] rounded-t-xl"
          priority={true}
        />
      </Link>
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-primary">{property.type}</div>
          <h3 className="text-xl font-bold">{property.name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-main font-bold text-right md:text-center lg:text-right">
          {getRatesDisplayed()}
        </h3>

        <div className="flex justify-center gap-4 text-secondary mb-4">
          <p>
            <Bed className="md:hidden lg:inline mr-2" size={16} />
            {property.beds}
            <span className="md:hidden lg:inline"> Beds</span>
          </p>
          <p>
            <Bath className="md:hidden lg:inline mr-2" size={16} />
            {property.baths}
            <span className="md:hidden lg:inline"> Baths</span>
          </p>
          <p>
            <Ruler className="md:hidden lg:inline mr-2" size={16} />
            {property.square_feet}
            <span className="md:hidden lg:inline"> sqft</span>
          </p>
        </div>
        {!property.isForSale && (
          <div className="flex justify-center gap-4 text-main text-sm mb-4">
            <p>
              <Banknote className="md:hidden lg:inline mr-2" />
              Weekly
            </p>
            <p>
              <Banknote className="md:hidden lg:inline mr-2" />
              Monthly
            </p>
          </div>
        )}

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col items-center lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <MapPin className="text-main mt-1" />
            <span className="text-main items-center flex">
              {property.location?.state}, {property.location?.country}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/properties/${property._id}`}
              className="h-[36px] bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-[5px] text-center text-sm"
            >
              Details
            </Link>
            {status === "authenticated" &&
              session?.user?.id &&
              property &&
              session.user.id === property.owner && (
                <Link
                  href={`/properties/${property._id}/edit`}
                  className="h-[36px] bg-[#E6B027] text-white px-4 py-2 rounded-[5px] text-center text-sm"
                >
                  Edit
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
