"use client";
import Image from "next/image";
import { Bell, Clock } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { assets } from "@/assets/assets";
// import { signOutUser } from "@/app/action/signOutUser";
import { useModal } from "./ModelContext";
import toast from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});

const LoginHeader = () => {
  const { openModal } = useModal();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error(error.message || "Failed to sign out");
      console.error("Sign-out error:", error);
    }
  };

  return (
    <header
      className={`${poppins.className} bg-[linear-gradient(219.84deg,_var(--text-primary)_4.14%,_var(--text-secondary)_44.22%)] text-white py-4 px-5 sm:px-10 md:px-20 flex justify-between items-center`}
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
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Clock size={24} />
          <span className="absolute top-0 right-0 text-xs bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center">
            12
          </span>
        </div>
        <div className="relative">
          <Bell size={24} />
          <span className="absolute top-0 right-0 text-xs bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center">
            12
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-none bg-white outline-none rounded-full cursor-pointer">
            <div className="flex items-center space-x-2 bg-white rounded-full p-1 md:p-2">
              <Image
                src={session?.user?.image || assets.default_profile}
                alt="User Avatar"
                width={25}
                height={25}
                className="rounded-full"
              />
              <span className="text-black hidden sm:block">{session?.user?.name ?? ""}</span>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 18 18"
                  stroke="currentColor"
                  className="text-yellow-500"
                >
                  <path
                    d="M14 7l-5 5-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white rounded-[5px] outline-none border-none">
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-300">
                <Link href="/profile" className="w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-300">
                <Link href="/properties/saved" className="w-full">
                  Saved Properties
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-300" onClick={() => signOut()}>
                <span className="w-full">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          className="bg-[#E6B027] text-white py-0 text-xs sm:text-sm md:text-base sm:py-1 md:py-2 px-2 sm:px-4 md:px-6 rounded-[5px] cursor-pointer"
          onClick={() => openModal("add-post")}
        >
          + Post
        </Button>
      </div>
    </header>
  );
};

export default LoginHeader;