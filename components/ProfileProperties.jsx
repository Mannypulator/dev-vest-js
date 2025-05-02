"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import axios from "axios";
import { assets } from "@/assets/assets";

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const handleDeleteProperty = async (propertyId) => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(propertyId));

    try {
      await axios.post(
        "/api/delete-property",
        { propertyId },
        { timeout: 30000 }
      );
      toast.success("Property deleted successfully");
      setProperties(
        properties.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete property";
      toast.error(errorMessage);
      console.error("Delete error:", errorMessage);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  if (!Array.isArray(properties) || properties.length === 0) {
    return <p className="text-secondary">No properties found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div
          key={property._id}
          className="mb-10 bg-white rounded-md shadow-md overflow-hidden"
        >
          <Link href={`/properties/${property._id}`}>
            <Image
              className="h-32 w-full rounded-t-md object-cover"
              src={property.images?.[0] || assets.default_profile}
              alt={property.name || "Property"}
              width={500}
              height={100}
              priority={true}
            />
          </Link>
          <div className="p-4">
            <p className="text-lg font-semibold text-primary truncate">
              {property.name || "Unnamed Property"}
            </p>
            <p className="text-secondary text-sm">
              Address: {property?.location?.street || "N/A"}{" "}
              {property?.location?.city || ""} {property?.location?.state || ""}
            </p>
            <div className="mt-2 flex gap-2">
              <Link
                href={`/properties/${property._id}/edit`}
                className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 text-sm"
              >
                Edit
              </Link>
              <Button
                onClick={() => handleDeleteProperty(property._id)}
                className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 text-sm"
                type="button"
                disabled={deletingIds.has(property._id)}
              >
                {deletingIds.has(property._id) ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileProperties;
