"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import deleteProperty from "@/app/action/deleteProperty";
import { assets } from "@/assets/assets";

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      await deleteProperty(propertyId);
      toast.success("Property Deleted");
      setProperties(
        properties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      toast.error("Failed to delete property");
      console.error("Delete error:", error);
    }
  };

  return properties.map((property) => (
    <div key={property._id} className="mb-10">
      <Link href={`/properties/${property._id}`}>
        <Image
          className="h-32 w-full rounded-md object-cover"
          src={property.images?.[0] || assets.default_profile}
          alt={property.name}
          width={500}
          height={100}
          priority={true}
        />
      </Link>
      <div className="mt-2">
        <p className="text-lg font-semibold text-primary">{property.name}</p>
        <p className="text-secondary">
          Address: {property?.location?.street || "N/A"}{" "}
          {property?.location?.city || ""} {property?.location?.state || ""}
        </p>
      </div>
      <div className="mt-2 flex gap-2">
        <Link
          href={`/properties/${property._id}/edit`}
          className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
        >
          Edit
        </Link>
        <Button
          onClick={() => handleDeleteProperty(property._id)}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
          type="button"
        >
          Delete
        </Button>
      </div>
    </div>
  ));
};

export default ProfileProperties;
