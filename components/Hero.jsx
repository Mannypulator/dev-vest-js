import check from "@/assets/images/check.svg";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative pt-10 pb-32 bg-[url('/hero.svg')] flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs"></div>
      <div className="relative z-10 container mx-auto px-4">
        <p className="mb-4 text-white flex flex-col space-y-4">
          <span className="font-extrabold text-4xl sm:text-7xl">
            Find Your Perfect
          </span>
          <span className="font-extrabold text-4xl sm:text-7xl">
            Future Home
          </span>
        </p>
        <p className="text-gray-300 text-base sm:text-lg mb-6 flex items-center gap-2">
          <Image
            src={check}
            height={22}
            width={22}
            priority={true}
            alt="check image"
          />
          Reliable, Secured, On Time. Let us handle the property choices.
        </p>
        <Link
          href="/properties"
          className="bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] text-white px-8 sm:px-12 py-3 sm:py-4 rounded hover:bg-gray-800 text-sm sm:text-base"
        >
          Discover more properties
        </Link>
      </div>
    </div>
  );
};

export default Hero;
