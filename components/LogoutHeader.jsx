"use client";
import { Button } from "./ui/button";
import logo from "@/assets/images/logo.svg";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { useModal } from "./modal-context";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const LogoutHeader = () => {
  const { openModal } = useModal();

  return (
    <header
      className={`${poppins.className} bg-[linear-gradient(219.84deg,_#474747_4.14%,_#222222_44.22%)] text-white py-4 px-24 flex justify-between items-center`}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src={logo}
            alt="Drive Vest Logo"
            height={40}
            width={40}
            className="rounded-full"
          />
        </Link>
      </div>
      <div className="space-x-4">
        <Button
          onClick={() => openModal("signup")}
          className={`${poppins.className} py-2 px-6 bg-[#E6B027] text-white rounded-lg`}
        >
          Register
        </Button>

        <Button
          onClick={() => openModal("login")}
          className={`${poppins.className} py-2 px-6 border bg-transparent border-[#E6B027] text-[#E6B027] rounded-lg`}
        >
          Log In
        </Button>
      </div>
    </header>
  );
};

export default LogoutHeader;
