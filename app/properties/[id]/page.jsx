import Property from "@/models/Property";
import User from "@/models/User";
import connectDB from "@/config/database";
import PropertyDetails from "@/components/PropertyDetails";
import { Poppins } from "next/font/google";
import { convertToSerializeableObject } from "@/utils/convertToObject";
import mongoose from "mongoose";

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function PropertyDetailPage({ params: paramsPromise }) {
  // Await params to resolve the Promise
  const params = await paramsPromise;

  // Check for valid params.id
  if (!params?.id || !mongoose.isValidObjectId(params.id)) {
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

    // Check if User model is registered
    const isUserModelRegistered = mongoose.models.User;
    console.log("User model registered:", !!isUserModelRegistered);

    let propertyDoc = await Property.findById(params.id).lean();

    if (!propertyDoc) {
      return (
        <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
          <div className="text-center text-red-500 text-xl">
            Property not found
          </div>
        </section>
      );
    }

    // Populate owner only if User model is registered
    if (isUserModelRegistered && propertyDoc.owner) {
      propertyDoc = await Property.findById(params.id)
        .populate("owner", "firstName lastName email")
        .lean();
    } else {
      console.warn(
        "Skipping populate: User model not registered or owner missing",
        {
          propertyId: params.id,
        }
      );
      // Ensure owner is null if not populated
      propertyDoc.owner = null;
    }

    // Serialize using convertToSerializeableObject
    const property = convertToSerializeableObject(propertyDoc);

    return (
      <section className={`${poppins.className} py-4 px-5 sm:px-10 md:px-20`}>
        <PropertyDetails property={property} />
      </section>
    );
  } catch (error) {
    console.error("Error in PropertyDetailPage:", {
      message: error.message,
      stack: error.stack,
      propertyId: params.id,
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
