import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getPropertiesByUser } from "../action/getPropertiesByUser";
import { assets } from "@/assets/assets";
import ProfileProperties from "@/components/ProfileProperties";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin"); // Redirect to NextAuth sign-in page
  }

  const userId = session.user.id;
  const properties = await getPropertiesByUser(userId); // Pass userId explicitly

  return (
    <section className="bg-blue-50">
      <div className="container m-auto py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="text-3xl font-bold mb-4 text-primary">Your Profile</h1>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 mx-20 mt-10">
              <div className="mb-4">
                <Image
                  className="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={session.user.image || assets.default_profile}
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>
              <h2 className="text-2xl mb-4">
                <span className="font-bold block text-primary">Name: </span>
                {session.user.name || "N/A"}
              </h2>
              <h2 className="text-2xl">
                <span className="font-bold block text-primary">Email: </span>
                {session.user.email || "N/A"}
              </h2>
            </div>
            <div className="md:w-3/4 md:pl-4">
              <h2 className="text-xl font-semibold mb-4 text-primary">
                Your Listings
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
