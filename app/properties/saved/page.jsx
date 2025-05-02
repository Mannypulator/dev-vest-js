import { Poppins } from "next/font/google";
import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import SavedPropertiesList from "@/components/SavedPropertiesList";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function SavedPropertiesPage() {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return (
        <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
          <div className="text-center text-red-500 text-xl">
            Please sign in to view saved properties
          </div>
        </section>
      );
    }

    const user = await User.findById(sessionUser.userId).lean();
    if (!user) {
      return (
        <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
          <div className="text-center text-red-500 text-xl">User not found</div>
        </section>
      );
    }

    const bookmarkIds = user.bookmarks || [];
    if (bookmarkIds.length === 0) {
      return (
        <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
          <div className="bg-white p-6 mx-7 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">Saved Properties</h1>
            <p className="text-gray-600">
              You have no saved properties. Start bookmarking properties to see
              them here!
            </p>
          </div>
        </section>
      );
    }

    const properties = await Property.find({
      _id: { $in: bookmarkIds },
    }).lean();

    const serializedProperties = properties.map((property) => ({
      _id: property._id.toString(),
      name: property.name || "Unnamed Property",
      type: property.type || "Unknown",
      images: Array.isArray(property.images) ? property.images : [],
      location: {
        street: property.location?.street || "",
        city: property.location?.city || "",
        state: property.location?.state || "",
      },
      price: property.price || 0,
      currency: property.currency || "USD",
      beds: property.beds || 0,
      baths: property.baths || 0,
      square_feet: property.square_feet || 0,
    }));

    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="bg-white p-6 mx-7 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Saved Properties</h1>
          <SavedPropertiesList properties={serializedProperties} />
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error in SavedPropertiesPage:", {
      message: error.message,
      stack: error.stack,
    });
    return (
      <section className={`${poppins.className} px-6 lg:px-24 py-12`}>
        <div className="text-center text-red-500 text-xl">
          Failed to load saved properties: {error.message}
        </div>
      </section>
    );
  }
}
