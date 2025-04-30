"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { Poppins } from "next/font/google";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useEffect, useState, useRef } from "react";
import { Country, State } from "country-state-city";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { signIn } from "next-auth/react";
import { assets } from "@/assets/assets";
import { useModal } from "./ModelContext";
import { signInDefaultValues } from "@/lib/constants";
import zxcvbn from "zxcvbn";
import axios from "axios";
import toast from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export function Modals() {
  const { activeModal, closeModal, openModal, modalData } = useModal();

  // State for form submissions
  const [loginState, setLoginState] = useState({
    success: false,
    message: "",
  });
  const [signUpState, setSignUpState] = useState({
    success: false,
    message: "",
  });
  const [addPropertyState, setAddPropertyState] = useState({
    success: false,
    message: "",
  });
  const [editPropertyState, setEditPropertyState] = useState({
    success: false,
    message: "",
  });

  // Property form states
  const [listingTitle, setListingTitle] = useState("");
  const [category, setCategory] = useState("Apartment");
  const [type, setType] = useState("For Sale");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [actualPrice, setActualPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [weeklyRate, setWeeklyRate] = useState("");
  const [monthlyRate, setMonthlyRate] = useState("");
  const [nightlyRate, setNightlyRate] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength for signup
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "bg-red-500",
    text: "text-red-500",
  });
  const [password, setPassword] = useState("");

  // Video upload states
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoError, setVideoError] = useState(null);

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

  // Password strength calculation
  useEffect(() => {
    if (password) {
      const result = zxcvbn(password);
      const score = result.score;
      const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
      const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-green-500",
        "bg-blue-500",
      ];
      const textColors = [
        "text-red-500",
        "text-orange-500",
        "text-yellow-500",
        "text-green-500",
        "text-blue-500",
      ];

      setPasswordStrength({
        score: score + 1,
        label: labels[score],
        color: colors[score],
        text: textColors[score],
      });
    } else {
      setPasswordStrength({
        score: 0,
        label: "",
        color: "bg-red-500",
        text: "text-red-500",
      });
    }
  }, [password]);

  // Load property data for edit modal
  useEffect(() => {
    if (activeModal === "edit-post" && modalData) {
      const fetchProperty = async () => {
        try {
          const response = await axios.get(`/api/properties/${modalData}`);
          const property = response.data.property;
          setListingTitle(property.name || "");
          setCategory(property.category || "Apartment");
          setType(property.isForSale ? "For Sale" : "For Rent");
          setCountry(property.location?.country || "");
          setState(property.location?.state || "");
          setCurrency(property.currency || "NGN");
          setActualPrice(property.price ? property.price.toLocaleString() : "");
          setDiscountPrice(
            property.discount ? property.discount.toLocaleString() : ""
          );
          setDescription(property.description || "");
          setSelectedImages(property.images || []);
          setSelectedAmenities(property.amenities || []);
          setWeeklyRate(
            property.rates?.weekly ? property.rates.weekly.toLocaleString() : ""
          );
          setMonthlyRate(
            property.rates?.monthly
              ? property.rates.monthly.toLocaleString()
              : ""
          );
          setNightlyRate(
            property.rates?.nightly
              ? property.rates.nightly.toLocaleString()
              : ""
          );
          setStreet(property.location?.street || "");
          setCity(property.location?.city || "");
          setZipcode(property.location?.zipcode || "");
          setBeds(property.beds?.toString() || "");
          setBaths(property.baths?.toString() || "");
          setSquareFeet(property.square_feet?.toString() || "");
          setSellerName(property.seller_info?.name || "");
          setSellerEmail(property.seller_info?.email || "");
          setSellerPhone(property.seller_info?.phone || "");
          setVideoPreview(property.videoUrl || null);
        } catch (error) {
          console.error("Error fetching property:", error);
          toast.error("Failed to load property data");
        }
      };
      fetchProperty();
    }
  }, [activeModal, modalData]);

  // Reset form on successful submission
  useEffect(() => {
    if (addPropertyState.success || editPropertyState.success) {
      setListingTitle("");
      setCategory("Apartment");
      setType("For Sale");
      setCountry("");
      setState("");
      setCurrency("NGN");
      setActualPrice("");
      setDiscountPrice("");
      setDescription("");
      setSelectedImages([]);
      setVideoPreview(null);
      setVideoError(null);
      setSelectedAmenities([]);
      setWeeklyRate("");
      setMonthlyRate("");
      setNightlyRate("");
      setStreet("");
      setCity("");
      setZipcode("");
      setBeds("");
      setBaths("");
      setSquareFeet("");
      setSellerName("");
      setSellerEmail("");
      setSellerPhone("");
      closeModal();
    }
  }, [addPropertyState.success, editPropertyState.success, closeModal]);

  // Form submission handlers
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLoginState({ success: false, message: "" });

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // Verify credentials server-side
      const response = await axios.post("/api/login", formData);
      toast.success(response.data.message);

      // Call signIn client-side to create session
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      setLoginState({
        success: true,
        message: response.data.message,
      });
      closeModal();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An error occurred during login";
      toast.error(errorMessage);
      setLoginState({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSignUpState({ success: false, message: "" });

    const formData = new FormData(event.target);

    try {
      const response = await axios.post("/api/signup", formData);
      toast.success(response.data.message);
      setSignUpState({
        success: true,
        message: response.data.message,
      });
      closeModal();
      openModal("login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An error occurred during registration";
      toast.error(errorMessage);
      setSignUpState({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPropertySubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAddPropertyState({ success: false, message: "" });

    const formData = new FormData(event.target);

    // Validate rates for For Rent
    if (
      type === "For Rent" &&
      !formData.get("rates.monthly") &&
      !formData.get("rates.weekly") &&
      !formData.get("rates.nightly")
    ) {
      setAddPropertyState({
        success: false,
        message:
          "At least one rental rate (monthly, weekly, or nightly) is required for For Rent properties",
      });
      toast.error(
        "At least one rental rate is required for For Rent properties"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/add-property", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
      setAddPropertyState({
        success: true,
        message: response.data.message,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to add property";
      toast.error(errorMessage);
      setAddPropertyState({
        success: false,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPropertySubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setEditPropertyState({ success: false, message: "" });

    const formData = new FormData(event.target);
    formData.append("propertyId", modalData);

    // Validate rates for For Rent
    if (
      type === "For Rent" &&
      !formData.get("rates.monthly") &&
      !formData.get("rates.weekly") &&
      !formData.get("rates.nightly")
    ) {
      setEditPropertyState({
        success: false,
        message:
          "At least one rental rate (monthly, weekly, or nightly) is required for For Rent properties",
      });
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
          timeout: 30000,
        });
        toast.success(response.data.message);
        setEditPropertyState({
          success: true,
          message: response.data.message,
        });
        return;
      } catch (error) {
        attempt++;
        const errorMessage =
          error.response?.data?.error || "Failed to update property";
        console.error(`Attempt ${attempt} failed:`, errorMessage);
        if (attempt === maxRetries) {
          setEditPropertyState({
            success: false,
            message: errorMessage,
          });
          toast.error(errorMessage);
          setLoading(false);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
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
    4;
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
    <>
      {/* Login Modal */}
      <Dialog open={activeModal === "login"} onOpenChange={closeModal}>
        <DialogContent className="bg-white p-6 py-10 w-full outline-0 border-none">
          <form onSubmit={handleLoginSubmit}>
            <DialogHeader>
              <div className="flex justify-center mb-4 space-y-0">
                <Image
                  className="-mb-4"
                  src={assets.logo}
                  alt="Drive Vest Logo"
                  height={40}
                  width={40}
                />
              </div>
              <DialogTitle
                className={`${poppins.className} text-center text-2xl font-bold mb-4`}
              >
                Log In
              </DialogTitle>
              <div className="flex max-w-1/2 gap-8 items-center mx-auto justify-center">
                <Button
                  type="button"
                  onClick={() => signIn("facebook")}
                  className="text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={assets.facebook}
                    alt="facebook logo"
                    height={15}
                    width={15}
                  />
                  <p className="hidden sm:block">Continue with Facebook</p>
                </Button>
                <Button
                  type="button"
                  onClick={() => signIn("google")}
                  className="text-black border-black border-[1px] rounded-[5px] text-xs"
                >
                  <Image
                    src={assets.google}
                    alt="Google logo"
                    height={15}
                    width={15}
                  />
                  <p className="hidden sm:block">Continue with Google</p>
                </Button>
              </div>
              <div className="text-center flex my-4 text-sm font-semibold items-center justify-center space-x-2">
                <hr className="border border-gray-300 w-full" />
                <p className="text-text-secondary font-normal text-sm">OR</p>
                <hr className="border border-gray-300 w-full" />
              </div>
            </DialogHeader>
            <div className="space-y-1">
              <div className="flex space-x-4 items-center">
                <div>
                  <Label className="text-xs font-normal text-text-primary py-2">
                    Email*
                  </Label>
                  <div className="border border-gray-400 rounded">
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      defaultValue={signInDefaultValues.email}
                      placeholder="Enter your email address"
                      className="w-full px-4 placeholder:text-text-secondary placeholder:text-xs placeholder:font-normal"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Label className="text-xs font-normal text-text-primary py-2">
                    Password*
                  </Label>
                  <div className="flex items-center border border-gray-400 rounded">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      autoComplete="current-password"
                      defaultValue={signInDefaultValues.password}
                      placeholder="Enter your password"
                      className="w-full px-4 placeholder:text-secondary placeholder:text-xs placeholder:font-normal"
                    />
                    <span
                      className="cursor-pointer pe-2"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Image
                        src={
                          showPassword ? assets.eye_slash_icon : assets.eye_icon
                        }
                        alt={showPassword ? "Hide password" : "Show password"}
                        className="cursor-pointer"
                      />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex justify-center items-center space-x-2">
                  <Input
                    type="checkbox"
                    className="w-2 border-text-secondary"
                  />
                  <Label className="text-xs text-text-secondary">
                    Remember me
                  </Label>
                </div>
                <p
                  onClick={() => openModal("forgot-password")}
                  className="text-xs text-text-secondary cursor-pointer"
                >
                  Forgot password?
                </p>
              </div>
            </div>
            <DialogFooter>
              <div className="flex flex-col justify-center items-center w-full">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary font-semibold text-base text-white"
                >
                  {loading ? "Logging In..." : "Log In"}
                </Button>
                {loginState.message && (
                  <div
                    className={`text-center ${
                      loginState.success ? "text-green-500" : "text-destructive"
                    }`}
                  >
                    {loginState.message}
                  </div>
                )}
                <div className="text-center text-xs font-bold mt-4">
                  Don't have an account?{" "}
                  <span
                    onClick={() => openModal("signup")}
                    className="font-bold text-primary text-xs cursor-pointer border-none outline-none"
                  >
                    create one
                  </span>
                </div>
                <p className="mt-6 text-xs">
                  By continuing, you agree to the Terms of Service
                  <br /> and acknowledge you've read our Privacy Policy.
                </p>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Register Modal */}
      <Dialog open={activeModal === "signup"} onOpenChange={closeModal}>
        <DialogContent className="bg-white p-6 py-10 w-full outline-0 border-none">
          <form onSubmit={handleSignUpSubmit}>
            <DialogHeader>
              <div className="flex justify-center mb-4 space-y-0">
                <Image
                  className="-mb-4"
                  src={assets.logo}
                  alt="Drive Vest Logo"
                  height={40}
                  width={40}
                />
              </div>
              <DialogTitle
                className={`${poppins.className} text-center text-2xl font-bold -mb-4`}
              >
                Create a new account
              </DialogTitle>
              <DialogDescription className="text-center text-xs text-gray-500 py-2">
                Full access to any of our products
              </DialogDescription>
              <div className="flex max-w-1/2 gap-8 items-center mx-auto justify-center">
                <Button
                  type="button"
                  onClick={() => signIn("facebook")}
                  className="text-black border-black border rounded-[5px] text-xs"
                >
                  <Image
                    src={assets.facebook}
                    alt="facebook logo"
                    height={15}
                    width={15}
                    priority={true}
                  />
                  <p className="hidden sm:block">Sign up with Facebook</p>
                </Button>
                <Button
                  type="button"
                  onClick={() => signIn("google")}
                  className="text-black border-black border rounded-[5px] text-xs"
                >
                  <Image
                    src={assets.google}
                    alt="Google logo"
                    height={15}
                    width={15}
                  />
                  <p className="hidden sm:block">Sign up with Google</p>
                </Button>
              </div>
              <div className="text-center flex my-4 text-sm font-semibold items-center justify-center space-x-2">
                <hr className="border-[0.4px] border-gray-300 w-full" />
                <p className="text-[#9F9C9C] font-normal text-sm">OR</p>
                <hr className="border-[0.4px] border-gray-300 w-full" />
              </div>
            </DialogHeader>
            <div className="space-y-1">
              <div className="flex space-x-4">
                <div className="py-2">
                  <Label className="text-xs font-normal text-[#0A0A0B]">
                    First Name*
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    required
                    type="text"
                    placeholder="Enter your first name"
                    className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                  />
                </div>
                <div className="py-2">
                  <Label className="text-xs font-normal text-[#0A0A0B]">
                    Last Name*
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    placeholder="Enter your last name"
                    className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                  />
                </div>
              </div>
              <div className="py-2">
                <Label className="text-xs font-normal text-[#0A0A0B]">
                  Email*
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                />
              </div>
              <div className="py-2">
                <Label className="text-xs font-normal text-[#0A0A0B]">
                  Phone Number*
                </Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  autoComplete="tel"
                  required
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
                />
              </div>
              <div className="flex flex-col">
                <Label className="text-xs font-normal text-text-primary py-2">
                  Password*
                </Label>
                <div className="flex items-center border border-gray-400 rounded">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className="w-full px-4 placeholder:text-secondary placeholder:text-xs placeholder:font-normal"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="cursor-pointer pe-2"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Image
                      src={
                        showPassword ? assets.eye_slash_icon : assets.eye_icon
                      }
                      alt={showPassword ? "Hide password" : "Show password"}
                      className="cursor-pointer"
                    />
                  </span>
                </div>
              </div>
              <div className="mt-2 w-full">
                <p className="text-sm text-gray-600">
                  Password Strength:{" "}
                  <span className={passwordStrength.text}>
                    {passwordStrength.label}
                  </span>
                </p>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`${passwordStrength.color} h-full rounded-full`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className={`${poppins.className} text-xs text-gray-500 py-2`}>
                Password must have minimum 7 characters
              </p>
            </div>
            <DialogFooter>
              <div className="flex flex-col justify-center items-center w-full">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] cursor-pointer"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
                {signUpState.message && (
                  <div
                    className={`text-center ${
                      signUpState.success
                        ? "text-green-500"
                        : "text-destructive"
                    }`}
                  >
                    {signUpState.message}
                  </div>
                )}
                <div className="text-center text-xs font-bold mt-4">
                  Already have an account?{" "}
                  <span
                    onClick={() => openModal("login")}
                    className="font-bold text-[#E6B027] text-xs cursor-pointer"
                  >
                    Log In
                  </span>
                </div>
                <p className="mt-6 text-xs">
                  By continuing, you agree to the Terms of Service
                  <br /> and acknowledge you've read our Privacy Policy.
                </p>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog
        open={activeModal === "forgot-password"}
        onOpenChange={closeModal}
      >
        <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
          <DialogHeader>
            <div className="flex justify-center mb-4 space-y-0">
              <Image
                className="-mb-4"
                src={assets.logo}
                alt="Drive Vest Logo"
                height={40}
                width={40}
              />
            </div>
            <DialogTitle className="text-center text-2xl font-bold -mb-4">
              Forgot Password
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">Email*</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Button
              onClick={() => {
                toast.success("Password reset email sent!");
                openModal("reset-password");
              }}
              className="w-full font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] cursor-pointer"
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={activeModal === "reset-password"} onOpenChange={closeModal}>
        <DialogContent className="bg-white w-[26rem] p-6 py-10 outline-0 border-none">
          <DialogHeader>
            <div className="flex justify-center mb-4 space-y-0">
              <Image
                className="-mb-4"
                src={assets.logo}
                alt="Drive Vest Logo"
                height={40}
                width={40}
              />
            </div>
            <DialogTitle className="text-center text-2xl font-bold -mb-4">
              Reset Password
            </DialogTitle>
          </DialogHeader>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Enter new password*
            </Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Label className="text-xs font-normal text-[#0A0A0B]">
              Confirm password*
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-gray-300 mt-2 rounded-[5px] placeholder:text-[#9F9C9C] placeholder:text-xs placeholder:font-normal"
            />
          </div>
          <div>
            <Button
              onClick={() => {
                toast.success("Password reset successful!");
                openModal("success");
              }}
              className="w-full font-semibold text-base text-white bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)]"
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={activeModal === "success"} onOpenChange={closeModal}>
        <DialogContent className="bg-white md:w-[5rem] lg:w-[26rem] p-6 py-10 outline-0 border-none">
          <DialogHeader>
            <Image
              className="mx-auto"
              src={assets.email}
              alt="email"
              height={66}
              width={67}
            />
          </DialogHeader>
          <DialogTitle className="text-center sm:text-sm lg:text-2xl font-bold lg:mb-4">
            Email sent, Check your inbox!
          </DialogTitle>
          <DialogDescription className="text-center text-xs text-gray-500">
            Should the email address you provided be registered with a Distress
            Sale account, you will receive a link to reset your password.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Add Post Modal */}
      <Dialog open={activeModal === "add-post"} onOpenChange={closeModal}>
        <DialogContent className="bg-white lg:w-full lg:max-w-xl max-h-[90vh] overflow-y-auto p-6 lg:rounded-[8px] lg:shadow-lg outline-none border-none">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              New Post
            </DialogTitle>
          </DialogHeader>
          <form
            ref={formRef}
            onSubmit={handleAddPropertySubmit}
            encType="multipart/form-data"
            className={`${poppins.className} mt-4 space-y-4`}
          >
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
            <div className="flex items-center justify-center px-5 gap-20">
              <div>
                <Label className="py-1">Select Type</Label>
                <Select
                  name="type"
                  onValueChange={(value) => setType(value)}
                  defaultValue={type}
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
              <div>
                <Label className="py-1">Select Category</Label>
                <Select
                  name="category"
                  onValueChange={(value) => setCategory(value)}
                  defaultValue={category}
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
            <div className="flex items-center justify-between py-5 px-5 gap-20">
              <div>
                <Label className="py-1">Country</Label>
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
              <div>
                <Label className="py-1">State</Label>
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
              <Label className="py-1">Street Address</Label>
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
            <div className="flex gap-8">
              <div>
                <Label className="py-1">City</Label>
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
                <Label className="py-1">Zipcode</Label>
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
            </div>
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-2">
                <br />
                <Select
                  name="currency"
                  onValueChange={(value) => setCurrency(value)}
                  defaultValue={currency}
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
            <div className="mb-4 flex flex-wrap">
              <div className="w-full sm:w-1/3 pr-2">
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
              <div className="w-full sm:w-1/3 px-2">
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
              <div className="w-full sm:w-1/3 pl-2">
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
              <div className="mb-4 bg-blue-50 p-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
                      onClick={() =>
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E6B027] text-white rounded-[5px]"
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
              {addPropertyState.message && (
                <div
                  className={`text-center ${
                    addPropertyState.success
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {addPropertyState.message}
                </div>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={activeModal === "edit-post"} onOpenChange={closeModal}>
        <DialogContent className="bg-white lg:w-full lg:max-w-xl max-h-[90vh] overflow-y-auto p-6 lg:rounded-[8px] lg:shadow-lg outline-none border-none">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Edit Property
            </DialogTitle>
          </DialogHeader>
          <form
            ref={formRef}
            onSubmit={handleEditPropertySubmit}
            encType="multipart/form-data"
            className={`${poppins.className} mt-4 space-y-4`}
          >
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
            <div className="flex items-center justify-center px-5 gap-20">
              <div>
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
              <div>
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
            <div className="flex items-center justify-between py-5 px-5 gap-20">
              <div>
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
              <div>
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
                <Label className={`${poppins.className}`}>Discount Price</Label>
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
                <Label>Actual Price</Label>
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
            <div className="mb-4 flex flex-wrap">
              <div className="w-full sm:w-1/3 pr-2">
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
              <div className="w-full sm:w-1/3 px-2">
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
              <div className="w-full sm:w-1/3 pl-2">
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
              <div className="mb-4 bg-blue-50 p-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
            <div className="mb-4">
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
                      onClick={() =>
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
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
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E6B027] text-white rounded-[5px]"
              >
                {loading ? "Updating..." : "Update"}
              </Button>
              {editPropertyState.message && (
                <div
                  className={`text-center ${
                    editPropertyState.success
                      ? "text-green-500"
                      : "text-destructive"
                  }`}
                >
                  {editPropertyState.message}
                </div>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
