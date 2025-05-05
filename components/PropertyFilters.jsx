"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin, Home, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const PropertyFilters = () => {
  const propertyTypes = [
    "All",
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
  ];
  const currencies = ["All", "₦", "$", "€", "£", "CAD"];

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [currency, setCurrency] = useState("All");
  const [isForSale, setIsForSale] = useState("All");

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedMaximumPrice = maximumPrice.replace(/[^0-9.]/g, "");
    if (cleanedMaximumPrice && isNaN(parseFloat(cleanedMaximumPrice))) {
      toast.error("Please enter a valid maximum price");
      return;
    }

    if (
      location === "" &&
      propertyType === "All" &&
      cleanedMaximumPrice === "" &&
      currency === "All" &&
      isForSale === "All"
    ) {
      router.push("/properties");
    } else {
      const query = `?location=${encodeURIComponent(
        location
      )}&propertyType=${encodeURIComponent(
        propertyType
      )}&maximumPrice=${encodeURIComponent(
        cleanedMaximumPrice
      )}&currency=${encodeURIComponent(
        currency
      )}&isForSale=${encodeURIComponent(isForSale)}`;
      router.push(`/properties/search${query}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <section className="border border-white shadow-sm outline-none top-[500px] md:left-20 container flex justify-center gap-8 py-4 px-5 sm:px-10 md:px-20 pt-6 bg-white items-center mx-auto rounded-tl-[10px] rounded-tr-[10px] w-full h-auto md:h-[150px] text-[#121212] text-nowrap">
        {/* Property Location */}
        <div className="flex relative flex-col lg:flex-row gap-10 mt-10 lg:mt-4 w-full">
          <div className="relative flex gap-2 flex-col sm:flex-row justify-between w-full">
            <div className="relative w-full flex flex-col gap-2 justify-between">
              <Label
                htmlFor="property-location"
                className="font-medium md:text-base text-sm"
              >
                Property Location
              </Label>
              <span className="absolute left-4 bottom-3 flex items-center pointer-events-none text-[#E6B027]">
                <MapPin size={18} />
              </span>
              <Input
                className="w-full rounded-[5px] pl-10 border border-[#00000040] outline-none"
                type="search"
                id="property-location"
                name="property-location"
                placeholder="Sao Paulo, Sao Paulo, Brazil"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="relative w-full flex flex-col gap-2 justify-between">
              <Label
                htmlFor="property-type"
                className="font-medium md:text-base text-sm"
              >
                Property Type
              </Label>
              <span className="absolute left-4 bottom-3 flex items-center pointer-events-none text-[#E6B027]">
                <Home size={18} />
              </span>
              <Select
                onValueChange={(value) => setPropertyType(value)}
                value={propertyType}
              >
                <SelectTrigger className="w-full border border-[#00000040] rounded-[5px] pl-10">
                  <SelectValue placeholder="Apartment" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-[5px]">
                  {propertyTypes.map((type) => (
                    <SelectItem className="bg-white" key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative w-full flex flex-col gap-2 justify-between">
              <Label
                htmlFor="maximum-price"
                className="font-medium md:text-base text-sm"
              >
                Maximum Price
              </Label>
              <span className="absolute left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
                <Tag size={18} />
              </span>
              <Input
                className="w-full rounded-[5px] pl-10 border border-[#00000040] outline-none"
                type="search"
                id="maximum-price"
                name="maximum-price"
                placeholder="5,000,000"
                value={maximumPrice}
                onChange={(e) => setMaximumPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="relative flex sm:flex-row flex-col w-full gap-2">
            <div className="relative flex gap-2 w-full justify-between">
              <div className="relative w-full flex flex-col gap-2 justify-between">
                <Label
                  htmlFor="currency"
                  className="font-medium md:text-base text-sm"
                >
                  Currency
                </Label>
                <Select
                  onValueChange={(value) => setCurrency(value)}
                  value={currency}
                >
                  <SelectTrigger className="w-full border border-[#00000040] rounded-[5px] pl-4">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[5px]">
                    {currencies.map((curr) => (
                      <SelectItem className="bg-white" key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative w-full flex flex-col gap-2 justify-between">
                <Label
                  htmlFor="sale-rent"
                  className="font-medium md:text-base text-sm"
                >
                  Sale or Rent
                </Label>
                <Select
                  onValueChange={(value) => setIsForSale(value)}
                  value={isForSale}
                >
                  <SelectTrigger className="w-full border border-[#00000040] rounded-[5px] pl-4">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-[5px]">
                    <SelectItem className="bg-white" value="All">
                      All
                    </SelectItem>
                    <SelectItem className="bg-white" value="Sale">
                      For Sale
                    </SelectItem>
                    <SelectItem className="bg-white" value="Rent">
                      For Rent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center px-8 py-2 bg-[#E6B027] rounded-[5px] sm:mt-8 text-white border-0 outline-none cursor-pointer"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
};

export default PropertyFilters;
