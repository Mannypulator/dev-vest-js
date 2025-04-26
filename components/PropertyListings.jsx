import React from "react";
import PropertyCard from "./PropertyCard";
import { getLatestProperties } from "@/lib/actions/property.actions"; // Import Property type
import { Poppins } from "next/font/google";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

interface PropertyListingsProps {
  title?: boolean;
  seeAllLink?: boolean;
}

const PropertyListings: React.FC<PropertyListingsProps> = async ({
  title = true,
  seeAllLink = true,
}) => {
  const latestProperties = await getLatestProperties();
  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-10">
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
          >
            See all <ChevronRight />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
};

export default PropertyListings;
