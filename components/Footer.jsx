import Image from "next/image";

import { ChevronDown, Globe } from "lucide-react";
import { Poppins, Outfit } from "next/font/google";
import { assets } from "@/assets/assets";

const poppins = Poppins({
  weight: "100",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: "300",
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <footer
      className={`${outfit.className} bg-[linear-gradient(219.84deg,_var(--text-primary)_4.14%,_var(--text-secondary)_44.22%)] text-white mt-10`}
    >
      <div className="container mx-auto py-6 px-5 sm:px-10 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 font-normal text-lg text-center md:text-left">
          <div className="flex flex-col items-center md:items-start justify-between">
            <Image
              className="mb-6"
              src={assets.logo}
              width={50}
              height={50}
              alt="drive vest logo"
              priority={true}
            />
            <ul className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <li>
                <Globe color="#e9e7e7" />
              </li>
              <li className="text-base font-normal">EN</li>
              <li>
                <ChevronDown color="#e9e7e7" />
              </li>
            </ul>
            <ul className="flex items-center justify-center md:justify-start gap-4 mt-2">
              <li>
                <Image
                  className="mb-6"
                  src={assets.facebook_logo}
                  width={20}
                  height={20}
                  alt="facebook logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={assets.x_logo}
                  width={20}
                  height={20}
                  alt="x logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={assets.skype_logo}
                  width={20}
                  height={20}
                  alt="skype logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={assets.instagram_logo}
                  width={20}
                  height={20}
                  alt="instagram logo"
                  priority={true}
                />
              </li>
              <li>
                <Image
                  className="mb-6"
                  src={assets.linkedin_logo}
                  width={20}
                  height={20}
                  alt="linkedin logo"
                  priority={true}
                />
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Company</h3>
            <ul className="space-y-1 text-sm">
              <li>About Us</li>
              <li>Advertise with Us</li>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Nigeria</h3>
            <ul className="space-y-1 text-sm">
              <li>Lagos</li>
              <li>Abuja</li>
              <li>Port-harcourt</li>
              <li>Ibadan</li>
              <li>Delta</li>
              <li>Kano</li>
              <li>Anambra</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Other Countries</h3>
            <ul className="space-y-1 text-sm">
              <li>Egypt</li>
              <li>Saudi Arabia</li>
              <li>Qatar</li>
              <li>Kuwait</li>
              <li>Lebanon</li>
              <li>Bahrain</li>
              <li>Oman</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Support</h3>
            <ul className="space-y-1 text-sm">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-base bg-[linear-gradient(97.73deg,_#E6B027_-6.96%,_#9E8441_23.5%,_#705614_92.79%)] bg-clip-text text-transparent text-center">
          © Drive West {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
