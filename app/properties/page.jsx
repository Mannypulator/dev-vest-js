import PropertyListings from "@/components/PropertyListings";
import { Poppins } from "next/font/google";
import Link from "next/link";

// Force dynamic rendering to avoid SSG/caching issues
export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PropertiesPage() {
  return (
    <section
      className={`${poppins.className} py-4 px-5 sm:px-10 md:px-20 w-full`}
    >
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-[#E6B027]">
          Home
        </Link>
        <span className="text-[#E6B027]">›</span>{" "}
        <span className="text-[#E6B027] font-semibold">Property for Sale</span>
      </div>
      <h2 className="text-xl py-8 lg:text-3xl font-bold text-[#E6B027] -mb-12">
        Property for Sale
      </h2>
      {/* Pass a high limit or null to fetch all properties */}
      <PropertyListings seeAllLink={false} title={false} limit={null} />
    </section>
  );
}