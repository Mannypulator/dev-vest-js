// app/properties/search/page.js
import PropertyCard from "@/components/PropertyCard";
import { Poppins } from "next/font/google";
import getFilteredProperties from "@/app/action/getFilteredProperties";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function SearchPage({ searchParams }) {
  const { location, propertyType, maximumPrice, currency, isForSale } =
    await searchParams;
  const { success, properties, error } = await getFilteredProperties({
    location,
    propertyType,
    maximumPrice,
    currency,
    isForSale,
  });

  return (
    <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
      <div className="sm:text-sm text-xs text-gray-500 bg-white flex items-center gap-2 pb-5">
        <Link href="/">
          <ArrowLeft color="#E6B027" className="cursor-pointer" />
        </Link>
        <Link href="/" className="hover:text-[#E6B027]">
          Home
        </Link>
        <span className="text-[#E6B027]">›</span>
        <span className="text-[#E6B027] font-semibold">Search Results</span>
      </div>
      
      {success ? (
        properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No properties match your search criteria
          </div>
        )
      ) : (
        <div className="text-red-500 bg-red-100 p-4 rounded-lg text-center">
          {error}
        </div>
      )}
    </section>
  );
}
