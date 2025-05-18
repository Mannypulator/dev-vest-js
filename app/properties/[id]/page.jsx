import Property from "@/models/Property";
import User from "@/models/User";
import connectDB from "@/config/database";
import PropertyDetails from "@/components/PropertyDetails";
import { Poppins } from "next/font/google";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import mongoose from "mongoose";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyContactForm from "@/components/PropertyContactForm";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata({ params }) {
  const paramsResolved = await params;
  try {
    await connectDB();
    const property = await Property.findById(paramsResolved.id).lean();
    if (!property) {
      return {
        title: "Property Not Found",
        description: "The requested property could not be found.",
      };
    }
    const serializedProperty = convertToSerializeableObject(property);
    return {
      title: `Drive Vest - ${serializedProperty.name}`,
      description:
        serializedProperty.description?.slice(0, 160) ||
        "View this property on PropertyPulse",
      openGraph: {
        title: serializedProperty.name,
        description: serializedProperty.description?.slice(0, 160),
        images: serializedProperty.images?.[0] || "/images/placeholder.jpg",
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${paramsResolved.id}`,
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", {
      message: error.message,
      stack: error.stack,
      propertyId: paramsResolved.id,
    });
    return {
      title: "Error",
      description: "Failed to load property metadata.",
    };
  }
}

export default async function PropertyDetailPage({ params }) {
  const paramsResolved = await params;

  if (!paramsResolved?.id || !mongoose.isValidObjectId(paramsResolved.id)) {
    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="text-center text-red-500 text-xl">
          Invalid property ID
        </div>
      </section>
    );
  }

  try {
    await connectDB();

    const propertyDoc = await Property.findById(paramsResolved.id)
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

    console.log("Raw propertyDoc:", propertyDoc);

    // Manually construct plain property object
    const property = {
      _id: propertyDoc._id.toString(),
      name: propertyDoc.name || "Unnamed Property",
      type: propertyDoc.type || "Unknown",
      images: Array.isArray(propertyDoc.images) ? propertyDoc.images : [],
      location: {
        street: propertyDoc.location?.street || "",
        city: propertyDoc.location?.city || "",
        state: propertyDoc.location?.state || "",
      },
      price: propertyDoc.price || 0,
      currency: propertyDoc.currency || "USD",
      discount: propertyDoc.discount || null,
      rates: {
        nightly: propertyDoc.rates?.nightly || null,
        weekly: propertyDoc.rates?.weekly || null,
        monthly: propertyDoc.rates?.monthly || null,
      },
      owner: propertyDoc.owner
        ? {
            firstName: propertyDoc.owner.firstName || "Unknown",
            lastName: propertyDoc.owner.lastName || "",
            email: propertyDoc.owner.email || "N/A",
          }
        : null,
      beds: propertyDoc.beds || 0,
      baths: propertyDoc.baths || 0,
      square_feet: propertyDoc.square_feet || 0,
      description: propertyDoc.description || "No description available",
      amenities: Array.isArray(propertyDoc.amenities)
        ? propertyDoc.amenities
        : [],
      videoUrl: propertyDoc.videoUrl || null,
    };

    console.log(
      "Serialized property for Client Components:",
      JSON.stringify(property)
    );

    return (
      <section
        className={`${poppins.className} bg-blue-50`}
      >
        <div className="">
          <PropertyDetails property={property} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in PropertyDetailPage:", {
      message: error.message,
      stack: error.stack,
      propertyId: paramsResolved.id,
      environment: process.env.NODE_ENV,
    });
    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="text-center text-red-500 text-xl">
          Failed to load property: {error.message}
        </div>
      </section>
    );
  }
}
