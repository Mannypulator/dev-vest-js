import React from "react";
import PropertyCard from "./PropertyCard";
import { Poppins } from "next/font/google";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import getLatestProperties from "@/app/action/getLatestProperties";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const PropertyListings = async ({ title = true, seeAllLink = true }) => {
  const { success, properties, error } = await getLatestProperties(
    LATEST_PRODUCTS_LIMIT
  );

  return (
    <section className="container mx-auto max-w-screen-xl py-4 px-5 sm:px-10 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        {title && (
          <h2
            className={`${poppins.className} text-2xl md:text-[28px] font-extrabold text-[#E6B027] mb-4 md:mb-0`}
          >
            Property for Sale
          </h2>
        )}
        {seeAllLink && (
          <Link
            href="/properties"
            className="text-[#E6B027] font-medium flex text-base md:text-[20px] items-center"
            aria-label="View all properties"
          >
            See all <ChevronRight />
          </Link>
        )}
      </div>
      {success ? (
        Array.isArray(properties) && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No properties available
          </div>
        )
      ) : (
        <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">
          {error || "An unexpected error occurred"}
        </div>
      )}
    </section>
  );
};

export default PropertyListings;
