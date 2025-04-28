import PropertyListings from "@/components/PropertyListings";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PropertiesPage() {
  return (
    <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <span>Home</span> <span className="text-[#E6B027]">›</span>{" "}
        <span className="text-[#E6B027] font-semibold">Property for Sale</span>
      </div>
      <h2 className="text-xl lg:text-3xl font-bold text-[#E6B027] mt-4 -mb-12">
        Property for Sale
      </h2>
      <PropertyListings seeAllLink={false} title={false} />
    </section>
  );
}
