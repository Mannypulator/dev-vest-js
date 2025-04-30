"use client";

import { useState, useEffect, useRef } from "react";
import { Poppins } from "next/font/google";
import { Country, State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function EditPropertyForm({ property }) {
  // Form states
  const [listingTitle, setListingTitle] = useState(property.name || "");
  const [category, setCategory] = useState(property.category || "Apartment");
  const [type, setType] = useState(
    property.isForSale ? "For Sale" : "For Rent"
  );
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState(property.location?.country || "");
  const [state, setState] = useState(property.location?.state || "");
  const [currency, setCurrency] = useState(property.currency || "NGN");
  const [actualPrice, setActualPrice] = useState(
    property.price ? property.price.toLocaleString() : ""
  );
  const [discountPrice, setDiscountPrice] = useState(
    property.discount ? property.discount.toLocaleString() : ""
  );
  const [description, setDescription] = useState(property.description || "");
  const [selectedImages, setSelectedImages] = useState(property.images || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState(
    property.amenities || []
  );
  const [weeklyRate, setWeeklyRate] = useState(
    property.rates?.weekly ? property.rates.weekly.toLocaleString() : ""
  );
  const [monthlyRate, setMonthlyRate] = useState(
    property.rates?.monthly ? property.rates.monthly.toLocaleString() : ""
  );
  const [nightlyRate, setNightlyRate] = useState(
    property.rates?.nightly ? property.rates.nightly.toLocaleString() : ""
  );
  const [street, setStreet] = useState(property.location?.street || "");
  const [city, setCity] = useState(property.location?.city || "");
  const [zipcode, setZipcode] = useState(property.location?.zipcode || "");
  const [beds, setBeds] = useState(property.beds?.toString() || "");
  const [baths, setBaths] = useState(property.baths?.toString() || "");
  const [squareFeet, setSquareFeet] = useState(
    property.square_feet?.toString() || ""
  );
  const [sellerName, setSellerName] = useState(
    property.seller_info?.name || ""
  );
  const [sellerEmail, setSellerEmail] = useState(
    property.seller_info?.email || ""
  );
  const [sellerPhone, setSellerPhone] = useState(
    property.seller_info?.phone || ""
  );
  const [videoPreview, setVideoPreview] = useState(property.videoUrl || null);
  const [videoError, setVideoError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();
  const formRef = useRef(null);

  // Load countries
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Update states based on country selection
  useEffect(() => {
    const selectedCountry = countries.find((c) => c.name === country);
    if (selectedCountry) {
      const statesOfCountry = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(statesOfCountry);
      if (!statesOfCountry.some((s) => s.name === state)) {
        setState("");
      }
    } else {
      setStates([]);
      setState("");
    }
  }, [country, countries]);

  // Form submission handler with retry
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    formData.append("propertyId", property._id);
    formData.append("existingImages", JSON.stringify(selectedImages));
    formData.append("removedImages", JSON.stringify(removedImages));

    // Validate rates for For Rent
    if (
      type === "For Rent" &&
      !formData.get("rates.monthly") &&
      !formData.get("rates.weekly") &&
      !formData.get("rates.nightly")
    ) {
      toast.error(
        "At least one rental rate is required for For Rent properties"
      );
      setLoading(false);
      return;
    }

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios.post("/api/edit-property", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 seconds
        });
        toast.success(response.data.message);
        router.push("/properties");
        return;
      } catch (error) {
        attempt++;
        const errorMessage =
          error.response?.data?.error || "Failed to update property";
        console.error(`Attempt ${attempt} failed:`, errorMessage);
        if (attempt === maxRetries) {
          setError(
            "Failed to update property after multiple attempts. Please try again."
          );
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  // Delete property handler
  const handleDeleteProperty = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "/api/delete-property",
        { propertyId: property._id },
        { timeout: 30000 }
      );
      toast.success(response.data.message);
      router.push("/properties");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete property";
      console.error("Delete property error:", errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
      setDeleteLoading(false);
    }
  };

  // Utility functions
  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (!files) return;
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const imageToRemove = selectedImages[index];
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    if (!imageToRemove.startsWith("blob:")) {
      setRemovedImages((prev) => [...prev, imageToRemove]);
    }
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setVideoError("Video file must be less than 50MB.");
      toast.error("Video file must be less than 50MB.");
      return;
    }

    const validFormats = [
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
    ];
    if (!validFormats.includes(file.type)) {
      setVideoError("Invalid format. Allowed formats: MP4, MOV, AVI, MKV.");
      toast.error("Invalid format. Allowed formats: MP4, MOV, AVI, MKV.");
      return;
    }

    setVideoError(null);
    const videoURL = URL.createObjectURL(file);
    setVideoPreview(videoURL);
  };

  const removeVideo = () => {
    setVideoPreview(null);
    setVideoError(null);
    formRef.current.querySelector('input[name="video"]').value = "";
  };

  const formatNumber = (value) => {
    const number = parseFloat(value.replace(/,/g, ""));
    if (isNaN(number)) return "";
    return new Intl.NumberFormat().format(number);
  };

  const handleActualPriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setActualPrice(formatNumber(rawValue));
    }
  };

  const handleDiscountPriceChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setDiscountPrice(formatNumber(rawValue));
    }
  };

  const handleRateChange = (e, setRate) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      setRate(formatNumber(rawValue));
    }
  };

  const amenities = [
    "Wifi",
    "Free Parking",
    "24/7 Security",
    "Dishwasher",
    "Balcony/Patio",
    "Full Kitchen",
    "Washer & Dryer",
    "Swimming Pool",
    "Wheelchair Accessible",
    "Gym/Fitness Center",
    "Smart TV",
    "Coffee Maker",
    "Air Conditioning",
    "Elevator Access",
    "Hot Tub",
  ];

  const categories = [
    "Apartment",
    "Condo",
    "House",
    "Cabin or Cottage",
    "Room",
    "Studio",
    "Other",
  ];

  const currencies = ["₦", "$", "€", "£", "CAD"];

  return (
    <div className={`${poppins.className} max-w-2xl mx-auto`}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="mt-4 space-y-4"
      >
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div>
          <Label className="pb-2">Listing Name</Label>
          <Input
            type="text"
            id="listingTitle"
            name="listingTitle"
            placeholder="Write a descriptive title"
            className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
            value={listingTitle}
            onChange={(e) => setListingTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="w-full">
            <Label>Select Type</Label>
            <Select
              name="type"
              onValueChange={(value) => setType(value)}
              value={type}
            >
              <SelectTrigger className="w-full border rounded-[5px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[5px]">
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Label>Select Category</Label>
            <Select
              name="category"
              onValueChange={(value) => setCategory(value)}
              value={category}
            >
              <SelectTrigger className="w-full border rounded-[5px]">
                <SelectValue placeholder="Apartment" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[5px]">
                {categories.map((cat) => (
                  <SelectItem className="bg-white" key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-8">
          <div className="w-full">
            <Label>Country</Label>
            <Select
              name="country"
              onValueChange={(val) => setCountry(val)}
              value={country}
            >
              <SelectTrigger className="w-full border rounded-[5px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[5px] max-h-64 overflow-y-auto">
                {countries.map((c) => (
                  <SelectItem key={c.isoCode} value={c.name}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
            <Label>State</Label>
            <Select
              name="state"
              onValueChange={(val) => setState(val)}
              value={state}
              disabled={!states.length}
            >
              <SelectTrigger className="w-full border rounded-[5px]">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[5px] max-h-64 overflow-y-auto">
                {states.map((s) => (
                  <SelectItem key={s.isoCode} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>Street Address</Label>
          <Input
            type="text"
            name="street"
            placeholder="Enter street address"
            className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            type="text"
            name="city"
            placeholder="Enter city"
            className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Zipcode</Label>
          <Input
            type="text"
            name="zipcode"
            placeholder="Enter zipcode"
            className="w-full rounded-[5px] placeholder:text-[#C4C4C4] placeholder:text-xs"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-2">
            <br />
            <Select
              name="currency"
              onValueChange={(value) => setCurrency(value)}
              value={currency}
            >
              <SelectTrigger className="border rounded-[5px]">
                <SelectValue placeholder="₦" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {currencies.map((cur) => (
                  <SelectItem className="bg-white" key={cur} value={cur}>
                    {cur}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4">
            <Label className={`${poppins.className}`}>Actual Price</Label>
            <Input
              name="actualPrice"
              className="placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px] mt-2"
              type="text"
              placeholder="Enter price"
              value={actualPrice}
              onChange={handleActualPriceChange}
              required
            />
          </div>
          <div className="col-span-4">
            <Label>Discount Price</Label>
            <Input
              name="discountPrice"
              className="placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px] mt-2"
              type="text"
              placeholder="Enter discount price"
              value={discountPrice}
              onChange={handleDiscountPriceChange}
            />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            placeholder="Type a detailed description of the listing"
            className="w-full border p-2 h-24 placeholder:text-[#C4C4C4] placeholder:text-xs rounded-[5px] my-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="beds"
              className="block text-gray-700 font-bold mb-2"
            >
              Beds
            </Label>
            <Input
              type="number"
              id="beds"
              name="beds"
              className="border rounded w-full py-2 px-3"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="baths"
              className="block text-gray-700 font-bold mb-2"
            >
              Baths
            </Label>
            <Input
              type="number"
              id="baths"
              name="baths"
              className="border rounded w-full py-2 px-3"
              value={baths}
              onChange={(e) => setBaths(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="square_feet"
              className="block text-gray-700 font-bold mb-2"
            >
              Square Feet
            </Label>
            <Input
              type="number"
              id="square_feet"
              name="square_feet"
              className="border rounded w-full py-2 px-3"
              value={squareFeet}
              onChange={(e) => setSquareFeet(e.target.value)}
              required
            />
          </div>
        </div>
        {type === "For Rent" && (
          <div className="bg-blue-50 p-4">
            <Label className="block text-gray-700 font-bold mb-2">
              Rates (at least one required)
            </Label>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex items-center">
                <Label htmlFor="weekly_rate" className="mr-2">
                  Weekly
                </Label>
                <Input
                  type="text"
                  id="weekly_rate"
                  name="rates.weekly"
                  className="border rounded w-full py-2 px-3"
                  value={weeklyRate}
                  onChange={(e) => handleRateChange(e, setWeeklyRate)}
                />
              </div>
              <div className="flex items-center">
                <Label htmlFor="monthly_rate" className="mr-2">
                  Monthly
                </Label>
                <Input
                  type="text"
                  id="monthly_rate"
                  name="rates.monthly"
                  className="border rounded w-full py-2 px-3"
                  value={monthlyRate}
                  onChange={(e) => handleRateChange(e, setMonthlyRate)}
                />
              </div>
              <div className="flex items-center">
                <Label htmlFor="nightly_rate" className="mr-2">
                  Nightly
                </Label>
                <Input
                  type="text"
                  id="nightly_rate"
                  name="rates.nightly"
                  className="border rounded w-full py-2 px-3"
                  value={nightlyRate}
                  onChange={(e) => handleRateChange(e, setNightlyRate)}
                />
              </div>
            </div>
          </div>
        )}
        <div>
          <Label
            htmlFor="seller_name"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Name
          </Label>
          <Input
            type="text"
            id="seller_name"
            name="seller_info.name"
            className="border rounded w-full py-2 px-3"
            placeholder="Name"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
          />
        </div>
        <div>
          <Label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Email
          </Label>
          <Input
            type="email"
            id="seller_email"
            name="seller_info.email"
            className="border rounded w-full py-2 px-3"
            placeholder="Email address"
            value={sellerEmail}
            onChange={(e) => setSellerEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label
            htmlFor="seller_phone"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Phone
          </Label>
          <Input
            type="tel"
            id="seller_phone"
            name="seller_info.phone"
            className="border rounded w-full py-2 px-3"
            placeholder="Phone"
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
          />
        </div>
        <div>
          <Label>Upload Photos</Label>
          <div className="flex gap-3 mt-2 flex-wrap">
            <label className="w-20 h-20 bg-[#F8E8BF] flex items-center justify-center cursor-pointer border-none outline-none rounded-[15px]">
              +
              <input
                name="images"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
            {selectedImages.map((image, index) => (
              <div
                key={`image-${index}`}
                className="relative w-20 h-20 max-h-20"
              >
                <Image
                  src={image}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-[15px]"
                  width={80}
                  height={80}
                />
                <Button
                  type="button"
                  className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                  onClick={() => removeImage(index)}
                >
                  ✖
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>Upload Video</Label>
          <div className="flex gap-3 mt-2 flex-wrap">
            <label className="w-20 h-20 bg-[#F8E8BF] flex items-center justify-center cursor-pointer border-none outline-none rounded-[15px]">
              +
              <input
                name="video"
                type="file"
                className="hidden"
                accept="video/mp4,video/mov,video/avi,video/mkv"
                onChange={handleVideoUpload}
              />
            </label>
            {videoPreview && (
              <div className="relative w-40 h-24">
                <video className="w-full h-full rounded-[15px]" controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <Button
                  type="button"
                  className="absolute top-0 right-0 bg-white border border-[#B6B6B6] text-black rounded-full w-4 h-4 text-xs flex items-center justify-center"
                  onClick={removeVideo}
                >
                  ✖
                </Button>
              </div>
            )}
          </div>
          {videoError && (
            <p className="text-red-500 text-xs mt-2">{videoError}</p>
          )}
        </div>
        <div>
          <Label className="font-medium text-gray-700">Amenities:</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {amenities.map((amenity, index) => (
              <div
                key={`amenity-${index}`}
                className="flex items-center gap-2.5"
              >
                <Checkbox
                  id={`amenity-${index}`}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={() => toggleAmenity(amenity)}
                  className="w-6 h-6 p-1 border border-[#E3E3E3] rounded-[3px] shadow-lg shadow-black/25"
                />
                <Label
                  htmlFor={`amenity-${index}`}
                  className="text-gray-600 text-sm cursor-pointer"
                >
                  {amenity}
                </Label>
                {selectedAmenities.includes(amenity) && (
                  <input type="hidden" name="amenities[]" value={amenity} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button
            type="button"
            disabled={deleteLoading || loading}
            onClick={handleDeleteProperty}
            className="bg-red-600 text-white rounded-[5px] px-6 hover:bg-red-700"
          >
            {deleteLoading ? "Deleting..." : "Delete Property"}
          </Button>
          <Button
            type="submit"
            disabled={loading || deleteLoading}
            className="bg-[#E6B027] text-white rounded-[5px] px-6"
          >
            {loading ? "Updating..." : "Update Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
