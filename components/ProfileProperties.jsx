"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { deletePropertyById } from "@/lib/actions/property.actions";
import { Button } from "./ui/button";

const ProfileProperties = ({ properties: initialProperties }) => {
  const [properties, setProperties] = useState(initialProperties);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    await deletePropertyById(propertyId);

    toast.success("Property Deleted");

    const updatedProperties = properties.filter(
      (property) => property.id !== propertyId
    );

    setProperties(updatedProperties);
  };

  return properties.map((property) => (
    <div key={property.id} className="mb-10">
      <Link href={`/properties/${property.id}`}>
        <Image
          className="h-32 w-full rounded-md object-cover"
          src={property.images[0]}
          alt=""
          width={500}
          height={100}
          priority={true}
        />
      </Link>
      <div className="mt-2">
        <p className="text-lg font-semibold">{property.name}</p>
        <p className="text-gray-600">
          Address: {property?.location?.street} {property?.location?.city}{" "}
          {property?.location?.state}
        </p>
      </div>
      <div className="mt-2">
        <Link
          href={`/properties/${property.id}/edit`}
          className="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
        >
          Edit
        </Link>
        <Button
          onClick={() => handleDeleteProperty(property.id)}
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
