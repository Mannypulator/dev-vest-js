import Property from "@/models/Property";
import connectDB from "@/config/database";
import PropertyDetails from "@/components/PropertyDetails";
import { Poppins } from "next/font/google";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function PropertyDetailPage({ params }) {
  await connectDB();

  // Check for valid params.id
  if (!params?.id) {
    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="text-center text-red-500 text-xl">
          Invalid property ID
        </div>
      </section>
    );
  }

  const propertyDoc = await Property.findById(params.id)
    .populate("owner", "firstName lastName email")
    .lean();

  if (!propertyDoc) {
    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="text-center text-red-500 text-xl">
          Property not found
        </div>
      </section>
    );
  }

  // Convert to plain object to remove MongoDB-specific types
  const property = JSON.parse(JSON.stringify(propertyDoc));

  return (
    <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
      <PropertyDetails property={property} />
    </section>
  );
}
