import { redirect } from "next/navigation";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import EditPropertyForm from "@/components/EditPropertyForm";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function PropertiesEditPage({ params: paramsPromise }) {
  // Await params to resolve the Promise
  const params = await paramsPromise;

  // Connect to database
  await connectDB();

  // Validate params.id
  if (!params?.id) {
    return (
      <section className="px-6 lg:px-24 py-12">
        <div className="text-center text-red-500 text-xl">
          Invalid property ID
        </div>
      </section>
    );
  }

  // Fetch property
  const propertyDoc = await Property.findById(params.id).lean();
  if (!propertyDoc) {
    return (
      <section className="px-6 lg:px-24 py-12">
        <div className="text-center text-red-500 text-xl">
          Property not found
        </div>
      </section>
    );
  }

  // Get session user
  const sessionUser = await getSessionUser();
  if (!sessionUser || !sessionUser.userId) {
    redirect("/signin");
  }

  // Verify ownership
  if (propertyDoc.owner.toString() !== sessionUser.userId) {
    return (
      <section className="px-6 lg:px-24 py-12">
        <div className="text-center text-red-500 text-xl">
          Unauthorized: You are not the owner of this property
        </div>
      </section>
    );
  }

  // Convert to plain object
  const property = JSON.parse(JSON.stringify(propertyDoc));

  return (
    <section className="px-6 lg:px-24 py-12">
      <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
      <EditPropertyForm property={property} />
    </section>
  );
}
