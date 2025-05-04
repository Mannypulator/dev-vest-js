import Image from "next/image";
import { redirect } from "next/navigation";
import { getPropertiesByUser } from "../action/getPropertiesByUser";
import { assets } from "@/assets/assets";
import ProfileProperties from "@/components/ProfileProperties";
import { auth } from "../auth";

export const dynamic = "force-dynamic"; // Prevent static rendering

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;
  console.log("User ID:", userId); // Debug: Log userId

  let properties = [];
  let error = null;

  try {
    properties = await getPropertiesByUser(userId);
    console.log("Fetched properties:", properties); // Debug: Log properties
  } catch (err) {
    console.error("Error fetching properties:", err);
    error = "Failed to load your properties. Please try again later.";
  }

  // Ensure properties is an array
  properties = Array.isArray(properties) ? properties : [];

  return (
    <section className="bg-blue-50 py-4 px-5 sm:px-10 md:px-20">
      <div className="container m-auto">
        <div className="bg-white mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4 text-primary pl-6 pt-6">
            Your Profile
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex flex-col">
            <div className="sm:px-20 px-5 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={session.user.image || assets.default_profile}
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>
              <h2 className="md:text-2xl sm:text-base mb-4">
                <span className="font-bold block text-primary">Name: </span>
                {session.user.name || "N/A"}
              </h2>
              <h2 className="md:text-2xl sm:text-base truncate">
                <span className="font-bold block text-primary">Email: </span>
                {session.user.email || "N/A"}
              </h2>
            </div>
            <div className="w-full px-5 sm:px-10 md:px-20 py-10">
              <h2 className="text-2xl font-extrabold mb-4 text-primary">
                Your Listings <span className="text-sm">(<span className="text-sm text-black">{properties.length}</span>)</span>
              </h2>
              {properties.length === 0 ? (
                <p className="text-secondary">You have no property listings</p>
              ) : (
                <ProfileProperties properties={properties} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
