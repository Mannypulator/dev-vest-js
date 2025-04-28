"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { assets } from "@/assets/assets";
import { useModal } from "./ModelContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const LogoutHeader = () => {
  const { openModal } = useModal();

  return (
    <header
      className={`${poppins.className} bg-[linear-gradient(219.84deg,_#474747_4.14%,_#222222_44.22%)] text-white py-4 px-5 sm:px-10 md:px-20 flex justify-between items-center`}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src={assets.logo}
            alt="Drive Vest Logo"
            height={40}
            width={40}
            className="rounded-full"
          />
        </Link>
      </div>
      <div className="md:space-x-4 space-x-2">
        <Button
          onClick={() => openModal("signup")}
          className={`${poppins.className} py-0 text-xs sm:text-sm md:text-base md:py-2 px-2 md:px-6 bg-[#E6B027] text-white rounded-lg`}
        >
          Register
        </Button>

        <Button
          onClick={() => openModal("login")}
          className={`${poppins.className} py-0 text-xs sm:text-sm md:text-base md:py-2 px-2 md:px-6 border bg-transparent border-[#E6B027] text-[#E6B027] rounded-lg`}
        >
          Log In
        </Button>
      </div>
    </header>
  );
};

export default LogoutHeader;
