import { Poppins } from "next/font/google";
import Image from "next/image";
import React from "react";
import { Bed, Bath, Ruler, MapPin, Banknote } from "lucide-react";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const PropertyCard = ({ property }) => {
  // get the rates displayed is returning undefined fix
  const getRatesDisplayed = () => {
    if (property.isForSale) {
      return `$${property?.price?.toLocaleString()}`;
    }
    if (property?.rates?.monthly) {
      return `$${property.rates.monthly.toLocaleString()}/mo`;
    } else if (property?.rates?.weekly) {
      return `$${property.rates.weekly.toLocaleString()}/wk`;
    } else if (property?.rates?.nightly) {
      return `$${property.rates.nightly.toLocaleString()}/night`;
    }
  };

  return (
    <div className={`rounded-xl shadow-md relative ${poppins.className}`}>
      <Link href={`/properties/${property?.id}`}>
        <Image
          src={property?.images[0] || "/images/placeholder.jpg"}
          alt=""
          height={0}
          width={0}
          sizes="100vw"
          className="w-full h-auto rounded-t-xl"
          priority={true}
        />
      </Link>
      <div className="p-4">
        <div className="text-left md:text-center lg:text-left mb-6">
          <div className="text-primary">{property?.type}</div>
          <h3 className="text-xl font-bold">{property?.name}</h3>
        </div>
        <h3 className="absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-main font-bold text-right md:text-center lg:text-right">
          {getRatesDisplayed()}
        </h3>

        <div className="flex justify-center gap-4 text-secondary mb-4">
          <p>
            <Bed className="md:hidden lg:inline mr-2" size={16} />
            {property?.beds}
            <span className="md:hidden lg:inline"> Beds</span>
          </p>
          <p>
            <Bath className="md:hidden lg:inline mr-2" size={16} />{" "}
            {property?.baths}
            <span className="md:hidden lg:inline"> Baths</span>
          </p>
          <p>
            <Ruler className="md:hidden lg:inline  mr-2" size={16} />{" "}
            {property?.squareFeet}
            <span className="md:hidden lg:inline"> sqft</span>
          </p>
        </div>
        {!property?.isForSale && (
          <div className="flex justify-center gap-4 text-main text-sm mb-4">
            <p>
              <Banknote className="md:hidden lg:inline mr-2" /> Weekly
            </p>
            <p>
              <Banknote className="md:hidden lg:inline mr-2" /> Monthly
            </p>
          </div>
        )}

        <div className="border border-gray-100 mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="flex align-middle gap-2 mb-4 lg:mb-0">
            <MapPin className="text-main mt-1" />
            <span className="text-main">
              {property?.location.city}, {property?.location.state}
            </span>
          </div>
          <Link
            href={`/properties/${property?.id}`}
            className="h-[36px] bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-[5px] text-center text-sm"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
