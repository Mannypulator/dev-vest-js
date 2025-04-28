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
      <section className="border border-white shadow-sm outline-none top-[500px] md:left-20 container flex flex-col md:flex-row justify-center gap-8 px-4 md:px-8 pt-6 bg-white rounded-tl-[10px] rounded-tr-[10px] w-full h-auto md:h-[120px] text-[#121212]">
        {/* Property Location */}
        <div className="relative w-full">
          <Label
            htmlFor="property-location"
            className="font-medium text-[14px]"
          >
            Property Location
          </Label>
          <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
            <MapPin size={18} />
          </span>
          <Input
            className="w-full h-10 rounded-[5px] pl-10 border border-[#00000040] outline-none"
            type="search"
            id="property-location"
            name="property-location"
            placeholder="Sao Paulo, Sao Paulo, Brazil"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-2/3">
          <Label htmlFor="property-type" className="font-medium text-[14px]">
            Property Type
          </Label>
          <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
            <Home size={18} />
          </span>
          <Select
            onValueChange={(value) => setPropertyType(value)}
            value={propertyType}
          >
            <SelectTrigger className="w-full border rounded-[5px] pl-10">
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
        <div className="relative w-full md:w-2/3">
          <Label htmlFor="maximum-price" className="font-medium text-[14px]">
            Maximum Price
          </Label>
          <span className="absolute inset-y-0 left-4 bottom-2 flex items-center pointer-events-none text-[#E6B027]">
            <Tag size={18} />
          </span>
          <Input
            className="w-full h-10 rounded-[5px] pl-10 border border-[#00000040] outline-none"
            type="search"
            id="maximum-price"
            name="maximum-price"
            placeholder="5,000,000"
            value={maximumPrice}
            onChange={(e) => setMaximumPrice(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-1/3">
          <Label htmlFor="currency" className="font-medium text-[14px]">
            Currency
          </Label>
          <Select
            onValueChange={(value) => setCurrency(value)}
            value={currency}
          >
            <SelectTrigger className="w-full border rounded-[5px] pl-4">
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
        <div className="relative w-full md:w-1/3">
          <Label htmlFor="sale-rent" className="font-medium text-[14px]">
            Sale or Rent
          </Label>
          <Select
            onValueChange={(value) => setIsForSale(value)}
            value={isForSale}
          >
            <SelectTrigger className="w-full border rounded-[5px] pl-4">
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
        <div>
          <Button
            type="submit"
            className="w-full md:w-auto px-8 py-2 bg-[#E6B027] rounded-[5px] mt-4 md:mt-6 text-white border-0 outline-none"
          >
            Search
          </Button>
        </div>
      </section>
    </form>
  );
};

export default PropertyFilters;
